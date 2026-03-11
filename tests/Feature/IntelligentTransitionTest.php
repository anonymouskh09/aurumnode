<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Services\PackagePurchaseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntelligentTransitionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_buy_any_higher_packages_and_rebuy_same_highest(): void
    {
        $purchaseService = app(PackagePurchaseService::class);
        $user = $this->createUserWithWallet(50000);
        $p100 = $this->createPackage(100, 'P100');
        $p500 = $this->createPackage(500, 'P500');
        $p1000 = $this->createPackage(1000, 'P1000');

        $purchaseService->purchase($user, $p100, 'deposit_wallet');
        $purchaseService->purchase($user->fresh(), $p500, 'deposit_wallet');
        $purchaseService->purchase($user->fresh(), $p1000, 'deposit_wallet');
        $purchaseService->purchase($user->fresh(), $p1000, 'deposit_wallet'); // same highest allowed

        $this->assertSame(4, UserPackage::where('user_id', $user->id)->count());
    }

    public function test_user_cannot_buy_lower_than_highest_purchased(): void
    {
        $purchaseService = app(PackagePurchaseService::class);
        $user = $this->createUserWithWallet(50000);
        $p500 = $this->createPackage(500, 'P500');
        $p1000 = $this->createPackage(1000, 'P1000');

        $purchaseService->purchase($user, $p1000, 'deposit_wallet');

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Lower package blocked');
        $purchaseService->purchase($user->fresh(), $p500, 'deposit_wallet');
    }

    public function test_rule_applies_to_existing_users_based_on_purchase_history(): void
    {
        $purchaseService = app(PackagePurchaseService::class);
        $user = $this->createUserWithWallet(50000);
        $p100 = $this->createPackage(100, 'P100');
        $p500 = $this->createPackage(500, 'P500');
        $p1000 = $this->createPackage(1000, 'P1000');

        // simulate old history: already bought 1000 before new rule
        UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $p1000->id,
            'invested_amount' => 1000,
            'activated_at' => now()->subDays(30),
            'status' => UserPackage::STATUS_EXPIRED_BY_4X,
            'is_maxed_out' => true,
            'total_earned' => 4000,
            'max_cap' => 4000,
            'cap_multiplier' => 4,
        ]);

        // same highest allowed
        $purchaseService->purchase($user->fresh(), $p1000, 'deposit_wallet');
        $this->assertDatabaseHas('user_packages', [
            'user_id' => $user->id,
            'package_id' => $p1000->id,
            'status' => UserPackage::STATUS_ACTIVE,
        ]);

        // lower blocked for old users too
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Lower package blocked');
        $purchaseService->purchase($user->fresh(), $p500, 'deposit_wallet');
    }

    private function createUserWithWallet(float $deposit): User
    {
        $user = User::factory()->create(['status' => User::STATUS_PAID]);
        Wallet::create([
            'user_id' => $user->id,
            'deposit_wallet' => $deposit,
            'investment_wallet' => 0,
            'withdrawal_wallet' => 0,
            'direct_bonus_wallet' => 0,
            'binary_bonus_wallet' => 0,
            'roi_wallet' => 0,
            'rank_award_wallet' => 0,
            'total_withdrawn' => 0,
            'total_roi' => 0,
            'total_bonus' => 0,
        ]);
        return $user;
    }

    private function createPackage(float $price, string $name): Package
    {
        return Package::create([
            'name' => $name,
            'display_name' => $name,
            'price_usd' => $price,
            'status' => 'active',
            'is_leader' => false,
            'is_admin_only' => false,
            'power_leg_points' => 0,
            'roi_enabled' => true,
            'roi_weekly_percent' => 2,
            'monthly_roi_rate' => 8,
            'binary_percent' => 8,
            'pays_direct_bonus' => true,
            'points_pass_up' => true,
        ]);
    }
}
