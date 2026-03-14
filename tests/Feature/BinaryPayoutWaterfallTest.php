<?php

namespace Tests\Feature;

use App\Models\BinaryBonusLog;
use App\Models\EarningsLedger;
use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Services\BinaryPayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BinaryPayoutWaterfallTest extends TestCase
{
    use RefreshDatabase;

    public function test_waterfall_credits_by_package_caps_and_clears_lesser_side_fully(): void
    {
        $service = app(BinaryPayoutService::class);
        $user = $this->createUserWithWallet();
        $user->update([
            'left_points_total' => 60000,
            'right_points_total' => 60000,
            'left_carry_total' => 0,
            'right_carry_total' => 0,
        ]);

        $p5000 = $this->createPackage(5000, 'P5000', 9);
        $p1000 = $this->createPackage(1000, 'P1000', 8);

        $up5000 = UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $p5000->id,
            'invested_amount' => 5000,
            'activated_at' => now()->subDays(10),
            'status' => UserPackage::STATUS_ACTIVE,
            'is_maxed_out' => false,
            'total_earned' => 19000, // remaining cap = 1000
            'max_cap' => 20000,
            'cap_multiplier' => 4,
        ]);
        $up1000 = UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $p1000->id,
            'invested_amount' => 1000,
            'activated_at' => now()->subDays(9),
            'status' => UserPackage::STATUS_ACTIVE,
            'is_maxed_out' => false,
            'total_earned' => 3500, // remaining cap = 500
            'max_cap' => 4000,
            'cap_multiplier' => 4,
        ]);
        EarningsLedger::create([
            'user_id' => $user->id,
            'user_package_id' => $up5000->id,
            'type' => EarningsLedger::TYPE_DIRECT,
            'amount' => 19000,
            'ref_id' => 'seed-up5000',
            'payout_run_id' => null,
        ]);
        EarningsLedger::create([
            'user_id' => $user->id,
            'user_package_id' => $up1000->id,
            'type' => EarningsLedger::TYPE_DIRECT,
            'amount' => 3500,
            'ref_id' => 'seed-up1000',
            'payout_run_id' => null,
        ]);

        $this->createQualifiedDirects($user);
        $service->runForWeek(now()->format('o-\WW'));

        $user->refresh();
        $this->assertEqualsWithDelta(1500.00, (float) $user->wallet->binary_bonus_wallet, 0.01);
        $this->assertEqualsWithDelta(0.00, (float) $user->left_carry_total, 0.01);
        $this->assertEqualsWithDelta(0.00, (float) $user->right_carry_total, 0.01);

        $this->assertSame(2, EarningsLedger::where('user_id', $user->id)->where('type', EarningsLedger::TYPE_BINARY)->count());
        $this->assertDatabaseHas('binary_bonus_logs', [
            'user_id' => $user->id,
            'status' => 'paid',
        ]);
    }

    public function test_no_active_package_forfeits_matched_volume_and_clears_lesser_side(): void
    {
        $service = app(BinaryPayoutService::class);
        $user = $this->createUserWithWallet();
        $user->update([
            'left_points_total' => 1000,
            'right_points_total' => 1000,
            'left_carry_total' => 0,
            'right_carry_total' => 0,
        ]);

        $service->runForWeek(now()->format('o-\WW'));

        $user->refresh();
        $this->assertEquals(0.0, (float) $user->wallet->binary_bonus_wallet);
        $this->assertEquals(0.0, (float) $user->left_carry_total);
        $this->assertEquals(0.0, (float) $user->right_carry_total);
        $this->assertEquals(0.0, (float) $user->left_points_total);
        $this->assertEquals(0.0, (float) $user->right_points_total);
        $this->assertSame(0, EarningsLedger::where('user_id', $user->id)->where('type', EarningsLedger::TYPE_BINARY)->count());
        $this->assertSame(0, BinaryBonusLog::where('user_id', $user->id)->count());
    }

    private function createUserWithWallet(): User
    {
        $user = User::factory()->create(['status' => User::STATUS_PAID]);
        Wallet::create([
            'user_id' => $user->id,
            'deposit_wallet' => 0,
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

    private function createQualifiedDirects(User $user): void
    {
        $left = $this->createUserWithWallet();
        $left->update([
            'sponsor_id' => $user->id,
            'placement_side' => User::PLACEMENT_LEFT,
            'status' => User::STATUS_PAID,
        ]);
        $right = $this->createUserWithWallet();
        $right->update([
            'sponsor_id' => $user->id,
            'placement_side' => User::PLACEMENT_RIGHT,
            'status' => User::STATUS_PAID,
        ]);

        $starter = $this->createPackage(100, 'P100', 8);
        UserPackage::create([
            'user_id' => $left->id,
            'package_id' => $starter->id,
            'invested_amount' => 100,
            'activated_at' => now()->subDays(5),
            'status' => UserPackage::STATUS_ACTIVE,
            'is_maxed_out' => false,
            'total_earned' => 0,
            'max_cap' => 400,
            'cap_multiplier' => 4,
        ]);
        UserPackage::create([
            'user_id' => $right->id,
            'package_id' => $starter->id,
            'invested_amount' => 100,
            'activated_at' => now()->subDays(5),
            'status' => UserPackage::STATUS_ACTIVE,
            'is_maxed_out' => false,
            'total_earned' => 0,
            'max_cap' => 400,
            'cap_multiplier' => 4,
        ]);
    }

    private function createPackage(float $price, string $name, float $binaryPercent): Package
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
            'binary_percent' => $binaryPercent,
            'pays_direct_bonus' => true,
            'points_pass_up' => true,
        ]);
    }
}
