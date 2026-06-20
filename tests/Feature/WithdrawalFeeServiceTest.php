<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Services\WithdrawalFeeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WithdrawalFeeServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_fee_percent_below_threshold(): void
    {
        Setting::set('withdrawal_fee_threshold_usd', 100);
        Setting::set('withdrawal_fee_percent_below', 10);
        Setting::set('withdrawal_fee_percent_at_or_above', 3);

        $service = app(WithdrawalFeeService::class);

        $this->assertSame(10.0, $service->resolveFeePercent(50));
        $fee = $service->calculateForAmount(50);
        $this->assertSame(10.0, $fee['percent']);
        $this->assertEqualsWithDelta(5.0, $fee['fee_amount'], 0.01);
        $this->assertEqualsWithDelta(55.0, $fee['total_deduct'], 0.01);
    }

    public function test_fee_percent_at_or_above_threshold(): void
    {
        Setting::set('withdrawal_fee_threshold_usd', 100);
        Setting::set('withdrawal_fee_percent_below', 10);
        Setting::set('withdrawal_fee_percent_at_or_above', 3);

        $service = app(WithdrawalFeeService::class);

        $this->assertSame(3.0, $service->resolveFeePercent(100));
        $this->assertSame(3.0, $service->resolveFeePercent(250));
        $fee = $service->calculateForAmount(100);
        $this->assertEqualsWithDelta(3.0, $fee['fee_amount'], 0.01);
        $this->assertEqualsWithDelta(103.0, $fee['total_deduct'], 0.01);
    }
}
