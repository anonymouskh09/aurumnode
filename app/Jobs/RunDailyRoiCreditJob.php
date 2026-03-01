<?php

namespace App\Jobs;

use App\Models\UserPackage;
use App\Models\RoiLog;
use App\Services\WalletService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RunDailyRoiCreditJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(WalletService $walletService): void
    {
        $rate = config('roi.rate', 0.001);

        UserPackage::where('status', 'active')->where('is_maxed_out', false)
            ->with('package')
            ->chunk(100, function ($packages) use ($walletService, $rate) {
                foreach ($packages as $up) {
                    if (! $up->package?->roi_enabled) {
                        continue;
                    }
                    $amount = round((float) $up->invested_amount * $rate, 2);
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
                        RoiLog::create(['user_id' => $up->user_id, 'user_package_id' => $up->id, 'date' => now()->toDateString(), 'amount' => $credit, 'rate' => $rate]);
                        if ((float) $up->fresh()->total_earned >= (float) $up->max_cap) {
                            $up->update(['is_maxed_out' => true, 'status' => 'expired']);
                        }
                    }
                }
            });
    }
}
