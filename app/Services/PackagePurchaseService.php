<?php

namespace App\Services;

use App\Models\Package;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Handles package purchase: wallet, points, direct bonus, status, cap.
 */
class PackagePurchaseService
{
    public function __construct(
        private WalletService $walletService,
        private VolumePointsService $volumePointsService,
        private DirectBonusService $directBonusService
    ) {}

    /**
     * @param  'deposit_wallet'|'withdrawal_wallet'  $payFrom
     */
    public function purchase(User $user, Package $package, string $payFrom = 'deposit_wallet'): void
    {
        $amount = (float) $package->price_usd;
        $isLeader = (bool) $package->is_leader;

        if (! in_array($payFrom, ['deposit_wallet', 'withdrawal_wallet'], true)) {
            $payFrom = 'deposit_wallet';
        }

        DB::transaction(function () use ($user, $package, $amount, $isLeader, $payFrom) {
            if ($payFrom === 'withdrawal_wallet') {
                $this->walletService->deductFromWithdrawal($user, $amount);
            } else {
                $this->walletService->deductFromDeposit($user, $amount);
            }

            $capMultiplier = 4;
            $maxCap = round($amount * $capMultiplier, 2);

            $userPackage = $user->userPackages()->create([
                'package_id' => $package->id,
                'invested_amount' => $amount,
                'activated_at' => now(),
                'status' => \App\Models\UserPackage::STATUS_ACTIVE,
                'max_cap' => $maxCap,
                'cap_multiplier' => $capMultiplier,
            ]);

            $user->update(['active_package_id' => $userPackage->id]);

            $this->walletService->addToInvestment($user, $amount);

            if ($user->userPackages()->sum('invested_amount') >= 100) {
                $user->update(['status' => User::STATUS_PAID]);
            }

            $this->volumePointsService->addPointsFromPurchase($user, $amount, $userPackage->id);

            $this->directBonusService->processDirectBonus($user, $amount, $userPackage->id, $package);

            if ($isLeader && $package->power_leg_points > 0) {
                $user->increment('left_points_total', $package->power_leg_points);
                VolumePointsLog::firstOrCreate(
                    ['user_id' => $user->id, 'date' => now()->toDateString()],
                    ['left_points' => 0, 'right_points' => 0, 'source' => 'leader_package']
                )->increment('left_points', $package->power_leg_points);
            }

            $user->transactions()->create([
                'type' => Transaction::TYPE_PACKAGE_PURCHASE,
                'amount' => $amount,
                'meta_json' => ['package_id' => $package->id, 'package_name' => $package->name],
            ]);
        });
    }
}
