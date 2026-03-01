<?php

namespace App\Jobs;

use App\Models\RoiLog;
use App\Models\Setting;
use App\Models\UserPackage;
use App\Services\WalletService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Weekly ROI distribution. Uses package roi_weekly_percent (admin-configurable).
 * Respects roi_global_enabled and max_cap (250% of investment from settings).
 */
class RunWeeklyRoiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(WalletService $walletService): void
    {
        if (! (bool) Setting::get('roi_global_enabled', true)) {
            return;
        }

        $weekStart = now()->startOfWeek()->toDateString();

        UserPackage::where('status', 'active')->where('is_maxed_out', false)
            ->with('package')
            ->chunk(100, function ($packages) use ($walletService, $weekStart) {
                foreach ($packages as $up) {
                    if (! $up->package?->roi_enabled) {
                        continue;
                    }
                    $weeklyPercent = $up->package->getWeeklyRoiPercent();
                    $amount = round((float) $up->invested_amount * ($weeklyPercent / 100), 2);
                    if ($amount <= 0) {
                        continue;
                    }
                    $remainingCap = (float) $up->max_cap - (float) $up->total_earned;
                    $credit = min($amount, max(0, $remainingCap));
                    if ($credit > 0) {
                        $wallet = $walletService->getOrCreateWallet($up->user);
                        $wallet->increment('roi_wallet', $credit);
                        $wallet->increment('total_roi', $credit);
                        $up->increment('total_earned', $credit);
                        RoiLog::create([
                            'user_id' => $up->user_id,
                            'user_package_id' => $up->id,
                            'date' => $weekStart,
                            'amount' => $credit,
                            'rate' => $weeklyPercent / 100,
                        ]);
                        if ((float) $up->fresh()->total_earned >= (float) $up->max_cap) {
                            $up->update(['is_maxed_out' => true, 'status' => 'expired']);
                        }
                    }
                }
            });
    }
}
