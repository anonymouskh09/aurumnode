<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\UserPackageProgress;
use App\Models\Wallet;
use App\Services\EarningsService;
use App\Services\PackagePurchaseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntelligentTransitionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_buy_same_package_multiple_times_before_any_maxout(): void
    {
        [$user, $package, $purchaseService] = array_slice($this->bootstrapUserWithWalletAndPackage(500, 'P500'), 0, 3);

        $purchaseService->purchase($user, $package, 'deposit_wallet');
        $purchaseService->purchase($user->fresh(), $package, 'deposit_wallet');

        $count = UserPackage::where('user_id', $user->id)->where('package_id', $package->id)->count();
        $this->assertSame(2, $count);
    }

    public function test_after_first_maxout_same_package_immediate_renew_is_allowed(): void
    {
        [$user, $package, $purchaseService, $earningsService] = $this->bootstrapUserWithWalletAndPackage(500, 'P500');
        $purchaseService->purchase($user, $package, 'deposit_wallet');
        $first = UserPackage::where('user_id', $user->id)->where('package_id', $package->id)->latest('id')->firstOrFail();

        // hit first maxout (500 * 4 = 2000)
        $credited = $earningsService->credit($user->fresh(), $first, 'DIRECT', 2000, 'mx-1', null);
        $this->assertSame(2000.0, $credited);

        // immediate same-package renew must be allowed after first maxout
        $purchaseService->purchase($user->fresh(), $package, 'deposit_wallet');
        $this->assertDatabaseHas('user_package_progress', [
            'user_id' => $user->id,
            'package_id' => $package->id,
            'maxout_count' => 1,
        ]);
    }

    public function test_after_second_maxout_same_package_requires_7_day_wait_but_higher_package_allowed(): void
    {
        [$user, $p500, $purchaseService, $earningsService] = $this->bootstrapUserWithWalletAndPackage(500, 'P500');
        $p2500 = $this->createPackage(2500, 'P2500');

        // first cycle
        $purchaseService->purchase($user, $p500, 'deposit_wallet');
        $up1 = UserPackage::where('user_id', $user->id)->where('package_id', $p500->id)->latest('id')->firstOrFail();
        $this->assertSame(2000.0, $earningsService->credit($user->fresh(), $up1, 'DIRECT', 2000, 'mx-a', null));

        // second cycle
        $purchaseService->purchase($user->fresh(), $p500, 'deposit_wallet');
        $up2 = UserPackage::where('user_id', $user->id)->where('package_id', $p500->id)->latest('id')->firstOrFail();
        $this->assertSame(2000.0, $earningsService->credit($user->fresh(), $up2, 'DIRECT', 2000, 'mx-b', null));

        // third immediate same-package buy should be blocked (7-day cooldown after second maxout)
        try {
            $purchaseService->purchase($user->fresh(), $p500, 'deposit_wallet');
            $this->fail('Expected same-package cooldown after second maxout');
        } catch (\RuntimeException $e) {
            $this->assertStringContainsString('cooldown', strtolower($e->getMessage()));
        }

        // but higher package should still be allowed immediately
        $purchaseService->purchase($user->fresh(), $p2500, 'deposit_wallet');
        $this->assertDatabaseHas('user_packages', [
            'user_id' => $user->id,
            'package_id' => $p2500->id,
            'status' => UserPackage::STATUS_ACTIVE,
        ]);
        $progress = UserPackageProgress::where('user_id', $user->id)
            ->where('package_id', $p500->id)
            ->firstOrFail();
        $this->assertSame(2, $progress->maxout_count);
    }

    private function bootstrapUserWithWalletAndPackage(float $price, string $name): array
    {
        $purchaseService = app(PackagePurchaseService::class);
        $earningsService = app(EarningsService::class);
        $user = User::factory()->create(['status' => User::STATUS_PAID]);
        Wallet::create([
            'user_id' => $user->id,
            'deposit_wallet' => 50000,
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
        $package = $this->createPackage($price, $name);

        return [$user, $package, $purchaseService, $earningsService];
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
