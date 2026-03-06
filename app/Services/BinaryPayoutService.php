<?php

namespace App\Services;

use App\Models\BinaryBonusLog;
use App\Models\EarningsLedger;
use App\Models\PayoutRun;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Binary bonus: daily closing. Lesser team volume × package binary %.
 * Carry-forward: left_carry_total, right_carry_total on users.
 * Idempotent via payout_runs (one run per period_key).
 */
class BinaryPayoutService
{
    public function __construct(
        private EarningsService $earningsService
    ) {}

    /**
     * Run binary payout for a given date. Uses period_key = Y-m-d.
     * Skips if run already completed (idempotent).
     */
    public function runForDate(\DateTimeInterface $date): PayoutRun
    {
        $periodKey = $date->format('Y-m-d');
        $run = PayoutRun::firstOrCreate(
            [
                'run_type' => PayoutRun::TYPE_BINARY_DAILY,
                'period_key' => $periodKey,
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
            DB::transaction(function () use ($run, $date, $periodKey) {
                $dateStr = $date->format('Y-m-d');
                $logByUser = VolumePointsLog::where('date', $dateStr)->get()->keyBy('user_id');

                $userIds = UserPackage::where('status', UserPackage::STATUS_ACTIVE)
                    ->where('is_maxed_out', false)
                    ->distinct()
                    ->pluck('user_id');
                foreach ($userIds as $userId) {
                    $userPackage = $this->getEarningPackageForUser($userId);
                    if ($userPackage) {
                        $this->processUserBinary(
                            $userPackage,
                            $logByUser->get($userId),
                            $run,
                            $periodKey
                        );
                    }
                }

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

    private function getEarningPackageForUser(int $userId): ?UserPackage
    {
        $user = User::find($userId);
        if ($user && $user->active_package_id) {
            $up = UserPackage::where('id', $user->active_package_id)->where('user_id', $userId)->first();
            if ($up && $up->isEarning()) {
                return $up;
            }
        }
        return UserPackage::where('user_id', $userId)
            ->where('status', UserPackage::STATUS_ACTIVE)
            ->where('is_maxed_out', false)
            ->with('package')
            ->orderByDesc('invested_amount')
            ->first();
    }

    private function processUserBinary(UserPackage $userPackage, ?VolumePointsLog $log, PayoutRun $run, string $periodKey): void
    {
        $user = $userPackage->user;
        $package = $userPackage->package;
        if (! $package || $this->earningsService->isCapReached($userPackage)) {
            return;
        }

        $leftCarry = (float) $user->left_carry_total;
        $rightCarry = (float) $user->right_carry_total;
        $leftLog = $log ? (float) $log->left_points : 0;
        $rightLog = $log ? (float) $log->right_points : 0;

        $leftVolume = $leftCarry + $leftLog;
        $rightVolume = $rightCarry + $rightLog;
        $lesser = min($leftVolume, $rightVolume);

        if ($lesser <= 0) {
            return;
        }

        $percent = $package->getBinaryPercent();
        $payoutAmount = round($lesser * ($percent / 100), 2);
        if ($payoutAmount <= 0) {
            return;
        }

        $credited = $this->earningsService->credit(
            $user,
            $userPackage,
            EarningsLedger::TYPE_BINARY,
            $payoutAmount,
            $periodKey,
            $run->id
        );

        if ($credited > 0) {
            BinaryBonusLog::create([
                'user_id' => $user->id,
                'date' => $periodKey,
                'left_points' => $leftVolume,
                'right_points' => $rightVolume,
                'lesser_points' => $lesser,
                'percent_used' => $percent,
                'payout_amount' => $credited,
                'carried_left' => $leftVolume - $lesser,
                'carried_right' => $rightVolume - $lesser,
                'status' => 'paid',
            ]);
            $user->refresh();
            $leftCarryNew = $leftVolume - $lesser;
            $rightCarryNew = $rightVolume - $lesser;
            $user->update([
                'left_carry_total' => $leftCarryNew,
                'right_carry_total' => $rightCarryNew,
                'left_points_total' => max(0, (float) $user->left_points_total - $lesser),
                'right_points_total' => max(0, (float) $user->right_points_total - $lesser),
            ]);
        }
    }
}
