<?php

namespace App\Services;

use App\Models\EarningsLedger;
use App\Models\PayoutRun;
use App\Models\Setting;
use App\Models\UserPackage;
use Illuminate\Support\Facades\DB;

/**
 * Weekly ROI: package price × (monthly_roi_rate / 4).
 * Leader (Access Package) gets no ROI. Idempotent via payout_runs.
 */
class RoiPayoutService
{
    public function __construct(
        private EarningsService $earningsService
    ) {}

    /**
     * Run ROI payout for the given week. period_key = e.g. 2025-W05.
     * Skips if run already completed.
     */
    public function runForWeek(string $weekKey): PayoutRun
    {
        if (! (bool) Setting::get('roi_global_enabled', true)) {
            throw new \RuntimeException('ROI payouts are disabled');
        }

        $run = PayoutRun::firstOrCreate(
            [
                'run_type' => PayoutRun::TYPE_ROI_WEEKLY,
                'period_key' => $weekKey,
            ],
            [
                'status' => PayoutRun::STATUS_PENDING,
                'started_at' => null,
                'finished_at' => null,
            ]
        );

        if ($run->status === PayoutRun::STATUS_COMPLETED) {
            return $run;
        }

        $run->update(['status' => PayoutRun::STATUS_RUNNING, 'started_at' => $run->started_at ?? now()]);

        try {
            DB::transaction(function () use ($run, $weekKey) {
                UserPackage::where('status', UserPackage::STATUS_ACTIVE)
                    ->where('is_maxed_out', false)
                    ->with(['user', 'package'])
                    ->chunk(100, function ($packages) use ($run, $weekKey) {
                        foreach ($packages as $userPackage) {
                            $this->processPackageRoi($userPackage, $run, $weekKey);
                        }
                    });

                $run->update(['status' => PayoutRun::STATUS_COMPLETED, 'finished_at' => now()]);
            });
        } catch (\Throwable $e) {
            $run->update([
                'status' => PayoutRun::STATUS_FAILED,
                'finished_at' => now(),
                'notes' => $e->getMessage(),
            ]);
            throw $e;
        }

        return $run->fresh();
    }

    private function processPackageRoi(UserPackage $userPackage, PayoutRun $run, string $weekKey): void
    {
        $package = $userPackage->package;
        if (! $package || ! $package->roi_enabled) {
            return; // Leader / Access Package: no ROI
        }
        if ($this->earningsService->isCapReached($userPackage)) {
            return;
        }

        $price = (float) $userPackage->invested_amount;
        $weeklyRate = $package->getWeeklyRoiRate() / 100; // e.g. 8% monthly -> 2% weekly
        $amount = round($price * $weeklyRate, 2);
        if ($amount <= 0) {
            return;
        }

        $this->earningsService->credit(
            $userPackage->user,
            $userPackage,
            EarningsLedger::TYPE_ROI,
            $amount,
            $weekKey,
            $run->id
        );
    }
}
