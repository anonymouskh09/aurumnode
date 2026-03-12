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
     * Compatibility wrapper: date maps to its ISO week payout.
     */
    public function runForDate(\DateTimeInterface $date): PayoutRun
    {
        $weekKey = \Carbon\Carbon::instance(\Carbon\Carbon::parse($date))->format('o-\WW');

        return $this->runForWeek($weekKey);
    }

    /**
     * Run weekly binary payout for a given ISO week key (e.g. 2026-W10).
     * Skips if run already completed (idempotent).
     */
    public function runForWeek(string $weekKey): PayoutRun
    {
        [$weekStart, $weekEnd] = $this->resolveWeekWindow($weekKey);
        $periodKey = $weekKey;
        $run = PayoutRun::firstOrCreate(
            [
                'run_type' => PayoutRun::TYPE_BINARY_WEEKLY,
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
            DB::transaction(function () use ($run, $periodKey, $weekStart, $weekEnd) {
                $logByUser = VolumePointsLog::query()
                    ->whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()])
                    ->selectRaw('user_id, SUM(left_points) as left_points, SUM(right_points) as right_points')
                    ->groupBy('user_id')
                    ->get()
                    ->keyBy('user_id');

                $userIds = collect()
                    ->merge(
                        UserPackage::where('status', UserPackage::STATUS_ACTIVE)
                            ->where('is_maxed_out', false)
                            ->distinct()
                            ->pluck('user_id')
                    )
                    ->merge($logByUser->keys())
                    ->merge(
                        User::query()
                            ->where('left_carry_total', '>', 0)
                            ->orWhere('right_carry_total', '>', 0)
                            ->orWhere('left_points_total', '>', 0)
                            ->orWhere('right_points_total', '>', 0)
                            ->pluck('id')
                    )
                    ->unique()
                    ->values();

                foreach ($userIds as $userId) {
                    $this->processUserBinary(
                        (int) $userId,
                        $this->getEarningPackagesForUser((int) $userId),
                        $logByUser->get($userId),
                        $run,
                        $periodKey,
                        $weekEnd->toDateString()
                    );
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

    private function getEarningPackagesForUser(int $userId)
    {
        return UserPackage::where('user_id', $userId)
            ->where('status', UserPackage::STATUS_ACTIVE)
            ->where('is_maxed_out', false)
            ->with('package')
            ->orderByDesc('invested_amount')
            ->get();
    }

    private function processUserBinary(
        int $userId,
        $earningPackages,
        ?object $log,
        PayoutRun $run,
        string $periodKey,
        string $logDate
    ): void
    {
        $user = User::find($userId);
        if (! $user) {
            return;
        }

        $earningPackages = $earningPackages ?? collect();
        $leftCarry = (float) $user->left_carry_total;
        $rightCarry = (float) $user->right_carry_total;
        $leftLog = $log ? (float) $log->left_points : 0;
        $rightLog = $log ? (float) $log->right_points : 0;
        $leftPointsTotal = (float) $user->left_points_total;
        $rightPointsTotal = (float) $user->right_points_total;

        // Keep payout math aligned with dashboard totals. This covers legacy data where
        // points_total existed before carry columns were introduced.
        $leftVolume = max($leftCarry + $leftLog, $leftPointsTotal);
        $rightVolume = max($rightCarry + $rightLog, $rightPointsTotal);
        $lesser = min($leftVolume, $rightVolume);

        if ($earningPackages->isEmpty()) {
            if ($lesser > 0) {
                $this->applyVolumeConsumption($user, $leftVolume, $rightVolume, $lesser);
                BinaryBonusLog::create([
                    'user_id' => $user->id,
                    'date' => $logDate,
                    'left_points' => $leftVolume,
                    'right_points' => $rightVolume,
                    'lesser_points' => $lesser,
                    'percent_used' => 0,
                    'payout_amount' => 0,
                    'carried_left' => $leftVolume - $lesser,
                    'carried_right' => $rightVolume - $lesser,
                    'status' => 'wasted_no_active_package',
                ]);
            }
            return;
        }

        if (! $this->hasBinaryUnlock($user)) {
            $this->syncCarryNoLoss($user, $leftVolume, $rightVolume);
            return;
        }

        if ($lesser <= 0) {
            // Persist unmatched volume into carry so it can match on future days.
            $this->syncCarryNoLoss($user, $leftVolume, $rightVolume);
            return;
        }

        $remainingMatched = $lesser;
        $consumedMatched = 0.0;
        $creditedTotal = 0.0;
        $weightedPercentNumerator = 0.0;

        foreach ($earningPackages as $userPackage) {
            if ($remainingMatched <= 0) {
                break;
            }

            $package = $userPackage->package;
            if (! $package || $this->earningsService->isCapReached($userPackage)) {
                continue;
            }

            $percent = (float) $package->getBinaryPercent();
            if ($percent <= 0) {
                continue;
            }

            $requestedAmount = $remainingMatched * ($percent / 100);
            if ($requestedAmount <= 0) {
                continue;
            }

            $credited = $this->earningsService->credit(
                $user,
                $userPackage,
                EarningsLedger::TYPE_BINARY,
                $requestedAmount,
                $periodKey,
                $run->id
            );

            if ($credited <= 0) {
                continue;
            }

            $consumedForPackage = min($remainingMatched, $credited / ($percent / 100));
            $consumedMatched += $consumedForPackage;
            $remainingMatched = max(0, $remainingMatched - $consumedForPackage);
            $creditedTotal += $credited;
            $weightedPercentNumerator += ($consumedForPackage * $percent);
        }

        if ($consumedMatched <= 0) {
            $this->syncCarryNoLoss($user, $leftVolume, $rightVolume);
            return;
        }

        $this->applyVolumeConsumption($user, $leftVolume, $rightVolume, $consumedMatched);
        $effectivePercent = $consumedMatched > 0 ? round($weightedPercentNumerator / $consumedMatched, 2) : 0.0;
        BinaryBonusLog::create([
            'user_id' => $user->id,
            'date' => $logDate,
            'left_points' => $leftVolume,
            'right_points' => $rightVolume,
            'lesser_points' => $lesser,
            'percent_used' => $effectivePercent,
            'payout_amount' => round($creditedTotal, 2),
            'carried_left' => $leftVolume - $consumedMatched,
            'carried_right' => $rightVolume - $consumedMatched,
            'status' => $consumedMatched < $lesser ? 'partial_paid' : 'paid',
        ]);
    }

    private function resolveWeekWindow(string $weekKey): array
    {
        if (! preg_match('/^(\d{4})-W(\d{2})$/', $weekKey, $m)) {
            throw new \InvalidArgumentException('Invalid week key format. Expected YYYY-Www');
        }

        $year = (int) $m[1];
        $week = (int) $m[2];
        $weekStart = \Carbon\Carbon::now()->setISODate($year, $week)->startOfWeek();
        $weekEnd = $weekStart->copy()->endOfWeek();

        return [$weekStart, $weekEnd];
    }

    private function hasBinaryUnlock(User $user): bool
    {
        $hasLeftPaidDirect = $user->referrals()
            ->where('placement_side', User::PLACEMENT_LEFT)
            ->whereHas('userPackages', function ($q) {
                $q->where('status', UserPackage::STATUS_ACTIVE)
                    ->where('is_maxed_out', false)
                    ->where('invested_amount', '>', 0);
            })
            ->exists();

        if (! $hasLeftPaidDirect) {
            return false;
        }

        $hasRightPaidDirect = $user->referrals()
            ->where('placement_side', User::PLACEMENT_RIGHT)
            ->whereHas('userPackages', function ($q) {
                $q->where('status', UserPackage::STATUS_ACTIVE)
                    ->where('is_maxed_out', false)
                    ->where('invested_amount', '>', 0);
            })
            ->exists();

        return $hasRightPaidDirect;
    }

    private function syncCarryNoLoss(User $user, float $leftVolume, float $rightVolume): void
    {
        $nextLeftCarry = max((float) $user->left_carry_total, $leftVolume);
        $nextRightCarry = max((float) $user->right_carry_total, $rightVolume);

        if (
            $nextLeftCarry !== (float) $user->left_carry_total
            || $nextRightCarry !== (float) $user->right_carry_total
        ) {
            $user->update([
                'left_carry_total' => $nextLeftCarry,
                'right_carry_total' => $nextRightCarry,
            ]);
        }
    }

    private function applyVolumeConsumption(User $user, float $leftVolume, float $rightVolume, float $matchedToConsume): void
    {
        $consume = max(0, min($matchedToConsume, min($leftVolume, $rightVolume)));
        $leftCarryNew = max(0, $leftVolume - $consume);
        $rightCarryNew = max(0, $rightVolume - $consume);

        $user->update([
            'left_carry_total' => $leftCarryNew,
            'right_carry_total' => $rightCarryNew,
            'left_points_total' => max(0, (float) $user->left_points_total - $consume),
            'right_points_total' => max(0, (float) $user->right_points_total - $consume),
        ]);
    }
}
