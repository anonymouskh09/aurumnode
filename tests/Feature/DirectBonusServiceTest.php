<?php

namespace Tests\Feature;

use App\Models\DirectBonusLog;
use App\Models\EarningsLedger;
use App\Models\Package;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Services\DirectBonusService;
use App\Services\EarningsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DirectBonusServiceTest extends TestCase
{
    use RefreshDatabase;

    private DirectBonusService $directBonusService;

    private EarningsService $earningsService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->directBonusService = app(DirectBonusService::class);
        $this->earningsService = app(EarningsService::class);
    }

    public function test_direct_bonus_is_paid_without_consuming_remaining_cap(): void
    {
        Setting::set('direct_bonus_percent', 20);

        $sponsor = User::factory()->create(['status' => User::STATUS_PAID]);
        $this->createWallet($sponsor);

        $sponsorPackage = $this->createPackage('Sponsor Package', 100);
        $earningPackage = UserPackage::create([
            'user_id' => $sponsor->id,
            'package_id' => $sponsorPackage->id,
            'invested_amount' => 100,
            'activated_at' => now()->subDay(),
            'status' => UserPackage::STATUS_ACTIVE,
            'total_earned' => 0,
            'max_cap' => 400,
            'cap_multiplier' => 4,
            'is_maxed_out' => false,
        ]);
        $sponsor->update(['active_package_id' => $earningPackage->id]);

        $seededRoi = $this->earningsService->credit(
            $sponsor,
            $earningPackage,
            EarningsLedger::TYPE_ROI,
            390,
            'seed-roi',
            null
        );

        $this->assertSame(390.0, $seededRoi);

        $buyer = User::factory()->create([
            'sponsor_id' => $sponsor->id,
            'status' => User::STATUS_PAID,
        ]);
        $buyerPackage = $this->createPackage('Buyer Package', 200);
        $buyerUserPackage = UserPackage::create([
            'user_id' => $buyer->id,
            'package_id' => $buyerPackage->id,
            'invested_amount' => 200,
            'activated_at' => now(),
            'status' => UserPackage::STATUS_ACTIVE,
            'total_earned' => 0,
            'max_cap' => 800,
            'cap_multiplier' => 4,
            'is_maxed_out' => false,
        ]);

        $this->directBonusService->processDirectBonus($buyer, 200.0, $buyerUserPackage->id, $buyerPackage);

        $sponsor->refresh();
        $earningPackage->refresh();

        $this->assertEqualsWithDelta(40.0, (float) $sponsor->wallet->direct_bonus_wallet, 0.01);
        $this->assertEqualsWithDelta(40.0, (float) $sponsor->wallet->total_bonus, 0.01);
        $this->assertEqualsWithDelta(390.0, $this->earningsService->getTotalEarningsForPackage($earningPackage->id), 0.01);
        $this->assertEqualsWithDelta(390.0, (float) $earningPackage->total_earned, 0.01);
        $this->assertEqualsWithDelta(10.0, $this->earningsService->getRemainingCap($earningPackage), 0.01);
        $this->assertSame(UserPackage::STATUS_ACTIVE, $earningPackage->status);
        $this->assertFalse((bool) $earningPackage->is_maxed_out);

        $log = DirectBonusLog::where('user_id', $sponsor->id)->first();
        $transaction = Transaction::where('user_id', $sponsor->id)
            ->where('type', Transaction::TYPE_DIRECT_BONUS)
            ->first();

        $this->assertNotNull($log);
        $this->assertEqualsWithDelta(20.0, (float) $log->percent, 0.01);
        $this->assertSame(1, EarningsLedger::where('user_id', $sponsor->id)->where('type', EarningsLedger::TYPE_DIRECT)->count());
        $this->assertNotNull($transaction);
        $this->assertEqualsWithDelta(20.0, (float) ($transaction->meta_json['percent'] ?? 0), 0.01);

        $finalRoi = $this->earningsService->credit(
            $sponsor,
            $earningPackage,
            EarningsLedger::TYPE_ROI,
            20,
            'final-roi',
            null
        );

        $this->assertSame(10.0, $finalRoi);

        $earningPackage->refresh();
        $this->assertSame(UserPackage::STATUS_EXPIRED_BY_4X, $earningPackage->status);
    }

    public function test_direct_bonus_is_skipped_without_an_active_sponsor_package(): void
    {
        $sponsor = User::factory()->create(['status' => User::STATUS_PAID]);
        $this->createWallet($sponsor);

        $expiredPackage = $this->createPackage('Expired Sponsor Package', 100);
        UserPackage::create([
            'user_id' => $sponsor->id,
            'package_id' => $expiredPackage->id,
            'invested_amount' => 100,
            'activated_at' => now()->subDays(2),
            'expired_at' => now()->subDay(),
            'status' => UserPackage::STATUS_EXPIRED_BY_4X,
            'total_earned' => 400,
            'max_cap' => 400,
            'cap_multiplier' => 4,
            'is_maxed_out' => true,
        ]);

        $buyer = User::factory()->create([
            'sponsor_id' => $sponsor->id,
            'status' => User::STATUS_PAID,
        ]);
        $buyerPackage = $this->createPackage('Buyer Package', 200);
        $buyerUserPackage = UserPackage::create([
            'user_id' => $buyer->id,
            'package_id' => $buyerPackage->id,
            'invested_amount' => 200,
            'activated_at' => now(),
            'status' => UserPackage::STATUS_ACTIVE,
            'total_earned' => 0,
            'max_cap' => 800,
            'cap_multiplier' => 4,
            'is_maxed_out' => false,
        ]);

        $this->directBonusService->processDirectBonus($buyer, 200.0, $buyerUserPackage->id, $buyerPackage);

        $sponsor->refresh();

        $this->assertEqualsWithDelta(0.0, (float) $sponsor->wallet->direct_bonus_wallet, 0.01);
        $this->assertSame(0, DirectBonusLog::where('user_id', $sponsor->id)->count());
        $this->assertSame(0, EarningsLedger::where('user_id', $sponsor->id)->where('type', EarningsLedger::TYPE_DIRECT)->count());
        $this->assertSame(0, Transaction::where('user_id', $sponsor->id)->where('type', Transaction::TYPE_DIRECT_BONUS)->count());
    }

    private function createWallet(User $user): void
    {
        Wallet::firstOrCreate(
            ['user_id' => $user->id],
            [
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
            ]
        );
    }

    private function createPackage(string $name, float $price, bool $paysDirectBonus = true): Package
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
            'pays_direct_bonus' => $paysDirectBonus,
            'points_pass_up' => true,
        ]);
    }
}
