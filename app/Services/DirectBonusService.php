<?php

namespace App\Services;

use App\Models\DirectBonusLog;
use App\Models\EarningsLedger;
use App\Models\Package;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Direct bonus: 10% of referred package price, instant at purchase.
 * Paid to sponsor. Cap enforced via EarningsService (hard stop at 4X).
 */
class DirectBonusService
{
    public function __construct(
        private EarningsService $earningsService
    ) {}

    public function processDirectBonus(User $buyer, float $packageAmount, int $referredUserPackageId, Package $package): void
    {
        if (! $package->pays_direct_bonus) {
            return;
        }

        $sponsor = $buyer->sponsor;
        if (! $sponsor) {
            return;
        }

        $buyerTotalInvested = $buyer->userPackages()->sum('invested_amount');
        if ($buyerTotalInvested < 100) {
            return;
        }

        if (! $sponsor->isPaid()) {
            return;
        }

        $sponsorPackage = $this->getEarningUserPackage($sponsor);
        if (! $sponsorPackage) {
            return; // expired_by_4x or no active package
        }

        if ($this->earningsService->isCapReached($sponsorPackage)) {
            return;
        }

        $bonusAmount = round($packageAmount * 0.10, 2);
        if ($bonusAmount <= 0) {
            return;
        }

        $refId = (string) $referredUserPackageId;
        DB::transaction(function () use ($sponsor, $sponsorPackage, $bonusAmount, $refId, $buyer, $referredUserPackageId) {
            $credited = $this->earningsService->credit(
                $sponsor,
                $sponsorPackage,
                EarningsLedger::TYPE_DIRECT,
                $bonusAmount,
                $refId,
                null
            );

            if ($credited <= 0) {
                return;
            }

            DirectBonusLog::create([
                'user_id' => $sponsor->id,
                'from_user_id' => $buyer->id,
                'user_package_id' => $referredUserPackageId,
                'amount' => $credited,
                'percent' => 10,
            ]);

            $sponsor->transactions()->create([
                'type' => Transaction::TYPE_DIRECT_BONUS,
                'amount' => $credited,
                'meta_json' => [
                    'from_user_id' => $buyer->id,
                    'from_username' => $buyer->username,
                    'from_name' => $buyer->name,
                    'percent' => 10,
                    'source' => 'direct_bonus',
                ],
            ]);
        });
    }

    /**
     * Sponsor's user_package that is currently earning (for cap and credit).
     */
    private function getEarningUserPackage(User $sponsor): ?\App\Models\UserPackage
    {
        $activeId = $sponsor->active_package_id;
        if ($activeId) {
            $up = \App\Models\UserPackage::find($activeId);
            if ($up && $up->isEarning()) {
                return $up;
            }
        }
        return $sponsor->userPackages()
            ->where('status', \App\Models\UserPackage::STATUS_ACTIVE)
            ->where('is_maxed_out', false)
            ->with('package')
            ->orderByDesc('invested_amount')
            ->first();
    }
}
