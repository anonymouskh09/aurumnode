<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Services\RoiPayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaderNoRoiTest extends TestCase
{
    use RefreshDatabase;

    public function test_leader_package_receives_no_roi(): void
    {
        $user = User::factory()->create();
        Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['deposit_wallet' => 0, 'withdrawal_wallet' => 0, 'direct_bonus_wallet' => 0, 'binary_bonus_wallet' => 0, 'roi_wallet' => 0, 'rank_award_wallet' => 0, 'total_withdrawn' => 0, 'total_roi' => 0, 'total_bonus' => 0]
        );

        $leaderPackage = Package::create([
            'name' => 'Access Package (Leader)',
            'price_usd' => 1000,
            'status' => 'active',
            'is_leader' => true,
            'roi_enabled' => false,
            'monthly_roi_rate' => 0,
        ]);
        UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $leaderPackage->id,
            'invested_amount' => 1000,
            'activated_at' => now(),
            'status' => 'active',
            'max_cap' => 4000,
            'cap_multiplier' => 4,
        ]);

        $service = app(RoiPayoutService::class);
        $service->runForWeek('2025-W05');

        $user->refresh();
        $roiWallet = (float) $user->wallet->roi_wallet;
        $this->assertSame(0.0, $roiWallet);
    }
}
