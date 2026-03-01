<?php

namespace App\Services;

use App\Models\BinaryBonusLog;
use App\Models\Rank;
use App\Models\Setting;
use App\Models\User;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Binary bonus: qualified users (1 paid left + 1 paid right) earn daily payout.
 * Percent by package: 100/500=7%, 1000/2500=8%, 5000/10000=9%, Rank1+=10%.
 */
class BinaryBonusService
{
    public function __construct(
        private WalletService $walletService
    ) {}

    public function qualifiesForBinaryBonus(User $user): bool
    {
        $leftPaid = $user->referrals()->where('placement_side', 'left')->where('status', 'paid')->exists();
        $rightPaid = $user->referrals()->where('placement_side', 'right')->where('status', 'paid')->exists();

        return $leftPaid && $rightPaid;
    }

    /** Binary %: from rank, or package tier, or admin setting. */
    public function getBinaryPercent(User $user): float
    {
        $topRank = $user->userRanks()->orderByDesc('ranks.level')->first();
        if ($topRank) {
            return (float) $topRank->binary_percent;
        }

        $activePackage = $user->userPackages()->where('status', 'active')->where('is_maxed_out', false)
            ->with('package')->get()->max(fn ($up) => (float) ($up->package?->price_usd ?? 0));

        $map = [100 => 7, 500 => 7, 1000 => 8, 2500 => 8, 5000 => 9, 10000 => 9];
        $default = (float) Setting::get('binary_bonus_percent', 10);

        return (float) ($map[(int) $activePackage] ?? $default);
    }

    public function runDailyPayout(\DateTimeInterface $date): void
    {
        $dateStr = $date->format('Y-m-d');

        User::query()->chunk(100, function ($users) use ($dateStr) {
            foreach ($users as $user) {
                $this->processUserPayout($user, $dateStr);
            }
        });
    }

    private function processUserPayout(User $user, string $dateStr): void
    {
        if (! $this->qualifiesForBinaryBonus($user)) {
            return;
        }

        $log = VolumePointsLog::where('user_id', $user->id)->where('date', $dateStr)->first();
        if (! $log) {
            return;
        }

        $leftPoints = (float) $log->left_points;
        $rightPoints = (float) $log->right_points;
        $lesserPoints = min($leftPoints, $rightPoints);

        if ($lesserPoints <= 0) {
            return;
        }

        $percent = $this->getBinaryPercent($user);
        $payoutAmount = round($lesserPoints * ($percent / 100), 2);

        if ($payoutAmount <= 0) {
            return;
        }

        $activePackage = $user->userPackages()->where('status', 'active')->where('is_maxed_out', false)->first();
        if (! $activePackage) {
            return;
        }

        $remainingCap = (float) $activePackage->max_cap - (float) $activePackage->total_earned;
        $creditAmount = min($payoutAmount, max(0, $remainingCap));
        $holdAmount = $payoutAmount - $creditAmount;

        DB::transaction(function () use ($user, $dateStr, $leftPoints, $rightPoints, $lesserPoints, $percent, $payoutAmount, $creditAmount, $holdAmount, $activePackage) {
            $carriedLeft = $leftPoints - $lesserPoints;
            $carriedRight = $rightPoints - $lesserPoints;

            BinaryBonusLog::create([
                'user_id' => $user->id,
                'date' => $dateStr,
                'left_points' => $leftPoints,
                'right_points' => $rightPoints,
                'lesser_points' => $lesserPoints,
                'percent_used' => $percent,
                'payout_amount' => $payoutAmount,
                'carried_left' => $carriedLeft,
                'carried_right' => $carriedRight,
                'status' => 'paid',
            ]);

            $user->decrement('left_points_total', $lesserPoints);
            $user->decrement('right_points_total', $lesserPoints);

            if ($creditAmount > 0) {
                $this->walletService->getOrCreateWallet($user);
                $user->wallet->increment('binary_bonus_wallet', $creditAmount);
                $user->wallet->increment('total_bonus', $creditAmount);
                $activePackage->increment('total_earned', $creditAmount);

                if ((float) $activePackage->total_earned >= (float) $activePackage->max_cap) {
                    $activePackage->update(['is_maxed_out' => true, 'status' => 'expired']);
                }
            }

            if ($holdAmount > 0) {
                $user->heldEarnings()->create(['amount' => $holdAmount, 'reason' => 'cap_exceeded']);
            }
        });
    }
}
