<?php

namespace Tests\Feature;

use App\Models\EarningsLedger;
use App\Models\PayoutRun;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\Package;
use App\Models\VolumePointsLog;
use App\Models\Wallet;
use App\Services\BinaryPayoutService;
use App\Services\RoiPayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayoutIdempotencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_binary_payout_run_completes_once_per_period(): void
    {
        $service = app(BinaryPayoutService::class);
        $date = new \DateTimeImmutable('2025-02-01');

        $run1 = $service->runForDate($date);
        $this->assertSame('completed', $run1->status);

        $run2 = $service->runForDate($date);
        $this->assertSame('completed', $run2->status);
        $this->assertSame($run1->id, $run2->id);

        $runs = PayoutRun::where('run_type', 'binary_weekly')->where('period_key', '2025-W05')->get();
        $this->assertCount(1, $runs);
    }

    public function test_roi_payout_run_completes_once_per_week(): void
    {
        $service = app(RoiPayoutService::class);
        $weekKey = '2025-W05';

        $run1 = $service->runForWeek($weekKey);
        $this->assertSame('completed', $run1->status);

        $run2 = $service->runForWeek($weekKey);
        $this->assertSame('completed', $run2->status);
        $this->assertSame($run1->id, $run2->id);
    }
}
