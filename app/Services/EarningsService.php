<?php

namespace App\Services;

use App\Models\EarningsLedger;
use App\Models\User;
use App\Models\UserPackage;
use Illuminate\Support\Facades\DB;

/**
 * Single source of truth for all earnings. All credits go through this service.
 * Enforces 4X cap: total_earnings = SUM(earnings_ledger) per user_package.
 * Cap = package price * cap_multiplier (default 4). Hard stop at cap.
 */
class EarningsService
{
    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Total earnings for a specific user_package (from ledger only).
     */
    public function getTotalEarningsForPackage(int $userPackageId): float
    {
        return (float) EarningsLedger::where('user_package_id', $userPackageId)->sum('amount');
    }

    /**
     * Cap for this package = price * cap_multiplier (default 4).
     */
    public function getPackageCap(UserPackage $userPackage): float
    {
        $price = (float) $userPackage->invested_amount;
        $multiplier = (float) ($userPackage->cap_multiplier ?? 4);

        return round($price * $multiplier, 2);
    }

    /**
     * Whether this package has reached its earning cap.
     */
    public function isCapReached(UserPackage $userPackage): bool
    {
        $total = $this->getTotalEarningsForPackage($userPackage->id);
        $cap = $this->getPackageCap($userPackage);

        return $total >= $cap;
    }

    /**
     * Remaining room until cap.
     */
    public function getRemainingCap(UserPackage $userPackage): float
    {
        $total = $this->getTotalEarningsForPackage($userPackage->id);
        $cap = $this->getPackageCap($userPackage);

        return max(0, round($cap - $total, 2));
    }

    /**
     * Credit earnings to user for a given package. Enforces cap: only credits up to remaining cap,
     * then marks package EXPIRED_BY_4X. Wallet + ledger updated in one transaction.
     *
     * @param  'DIRECT'|'BINARY'|'ROI'  $type
     * @return float Amount actually credited (may be less than $amount if cap hit)
     */
    public function credit(
        User $user,
        UserPackage $userPackage,
        string $type,
        float $amount,
        ?string $refId = null,
        ?int $payoutRunId = null
    ): float {
        if ($amount <= 0) {
            return 0.0;
        }

        $walletColumn = match ($type) {
            EarningsLedger::TYPE_DIRECT => 'direct_bonus_wallet',
            EarningsLedger::TYPE_BINARY => 'binary_bonus_wallet',
            EarningsLedger::TYPE_ROI => 'roi_wallet',
            default => throw new \InvalidArgumentException("Unknown earnings type: {$type}"),
        };

        $remaining = $this->getRemainingCap($userPackage);
        if ($remaining <= 0) {
            $this->expirePackageIfNotAlready($userPackage);
            return 0.0;
        }

        $creditAmount = min($amount, $remaining);
        $creditAmount = round($creditAmount, 2);
        if ($creditAmount <= 0) {
            return 0.0;
        }

        try {
            DB::transaction(function () use ($user, $userPackage, $type, $creditAmount, $refId, $payoutRunId, $walletColumn) {
                EarningsLedger::create([
                    'user_id' => $user->id,
                    'user_package_id' => $userPackage->id,
                    'type' => $type,
                    'amount' => $creditAmount,
                    'ref_id' => $refId,
                    'payout_run_id' => $payoutRunId,
                ]);

                $this->walletService->getOrCreateWallet($user);
                $user->wallet->increment($walletColumn, $creditAmount);
                if (in_array($type, [EarningsLedger::TYPE_DIRECT, EarningsLedger::TYPE_BINARY], true)) {
                    $user->wallet->increment('total_bonus', $creditAmount);
                } else {
                    $user->wallet->increment('total_roi', $creditAmount);
                }

                $userPackage->increment('total_earned', $creditAmount);

                $newTotal = $this->getTotalEarningsForPackage($userPackage->id);
                $cap = $this->getPackageCap($userPackage);
                if ($newTotal >= $cap) {
                    $this->expirePackageIfNotAlready($userPackage);
                }
            });
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000' || str_contains($e->getMessage(), 'Duplicate')) {
                return 0.0; // Idempotent: already credited for this ref
            }
            throw $e;
        }

        return $creditAmount;
    }

    /**
     * Mark package as EXPIRED_BY_4X and set expired_at. Idempotent.
     */
    public function expirePackageIfNotAlready(UserPackage $userPackage): void
    {
        if (
            $userPackage->status === UserPackage::STATUS_EXPIRED_BY_4X
            && $userPackage->locked_investment_released_at
        ) {
            return;
        }

        $user = $userPackage->user;

        if ($userPackage->status !== UserPackage::STATUS_EXPIRED_BY_4X) {
            $userPackage->update([
                'status' => UserPackage::STATUS_EXPIRED_BY_4X,
                'expired_at' => $userPackage->expired_at ?? now(),
                'is_maxed_out' => true,
            ]);
        }

        if ($user && ! $userPackage->locked_investment_released_at) {
            $wallet = $this->walletService->getOrCreateWallet($user);
            $currentInvestment = (float) ($wallet->investment_wallet ?? 0);
            $packagePrincipal = (float) $userPackage->invested_amount;
            $deductAmount = min($currentInvestment, $packagePrincipal);
            if ($deductAmount > 0) {
                $wallet->decrement('investment_wallet', $deductAmount);
            }
            $userPackage->update([
                'locked_investment_released_at' => now(),
            ]);
        }

        if ($user && (int) $user->active_package_id === (int) $userPackage->id) {
            $user->update(['active_package_id' => null]);
        }

        if ($userPackage->leader_activation_mode === 'ADMIN_GRANTED') {
            $userPackage->update(['renewal_required' => true]);
        }
    }
}
