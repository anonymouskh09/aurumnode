<?php

namespace Tests\Feature;

use App\Models\EarningsLedger;
use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Services\EarningsService;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EarningsServiceTest extends TestCase
{
    use RefreshDatabase;

    private EarningsService $earningsService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->earningsService = app(EarningsService::class);
    }

    public function test_cap_is_4x_of_package_price(): void
    {
        $user = User::factory()->create();
        $package = Package::create([
            'name' => 'Starter',
            'price_usd' => 100,
            'status' => 'active',
            'binary_percent' => 8,
            'monthly_roi_rate' => 8,
        ]);
        $userPackage = UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'invested_amount' => 100,
            'activated_at' => now(),
            'status' => 'active',
            'max_cap' => 400,
            'cap_multiplier' => 4,
        ]);

        $cap = $this->earningsService->getPackageCap($userPackage);
        $this->assertSame(400.0, $cap);
    }

    public function test_credit_stops_at_cap_and_expires_package(): void
    {
        $user = User::factory()->create();
        Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['deposit_wallet' => 0, 'withdrawal_wallet' => 0, 'direct_bonus_wallet' => 0, 'binary_bonus_wallet' => 0, 'roi_wallet' => 0, 'rank_award_wallet' => 0, 'total_withdrawn' => 0, 'total_roi' => 0, 'total_bonus' => 0]
        );
        $package = Package::create(['name' => 'Starter', 'price_usd' => 100, 'status' => 'active', 'binary_percent' => 8, 'monthly_roi_rate' => 8]);
        $userPackage = UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'invested_amount' => 100,
            'activated_at' => now(),
            'status' => 'active',
            'max_cap' => 400,
            'cap_multiplier' => 4,
        ]);

        $cred1 = $this->earningsService->credit($user, $userPackage, EarningsLedger::TYPE_ROI, 300, 'W1', null);
        $this->assertSame(300.0, $cred1);

        $cred2 = $this->earningsService->credit($user, $userPackage, EarningsLedger::TYPE_ROI, 200, 'W2', null);
        $this->assertSame(100.0, $cred2);

        $userPackage->refresh();
        $this->assertSame('EXPIRED_BY_4X', $userPackage->status);

        $cred3 = $this->earningsService->credit($user, $userPackage, EarningsLedger::TYPE_ROI, 50, 'W3', null);
        $this->assertSame(0.0, $cred3);
    }

    public function test_total_earnings_from_ledger(): void
    {
        $user = User::factory()->create();
        Wallet::firstOrCreate(['user_id' => $user->id], ['deposit_wallet' => 0, 'withdrawal_wallet' => 0, 'direct_bonus_wallet' => 0, 'binary_bonus_wallet' => 0, 'roi_wallet' => 0, 'rank_award_wallet' => 0, 'total_withdrawn' => 0, 'total_roi' => 0, 'total_bonus' => 0]);
        $package = Package::create(['name' => 'Starter', 'price_usd' => 100, 'status' => 'active']);
        $userPackage = UserPackage::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'invested_amount' => 100,
            'activated_at' => now(),
            'status' => 'active',
            'max_cap' => 400,
            'cap_multiplier' => 4,
        ]);

        $total = $this->earningsService->getTotalEarningsForPackage($userPackage->id);
        $this->assertSame(0.0, $total);

        $this->earningsService->credit($user, $userPackage, EarningsLedger::TYPE_ROI, 50, 'w1', null);
        $total = $this->earningsService->getTotalEarningsForPackage($userPackage->id);
        $this->assertSame(50.0, $total);
    }
}
