<?php

namespace App\Console;

use App\Services\RoiPayoutService;
use Illuminate\Console\Command;

class PayoutRoiWeeklyCommand extends Command
{
    protected $signature = 'payout:roi-weekly {--week= : Week key (e.g. 2025-W05), default previous week}';

    protected $description = 'Run weekly ROI payout (idempotent).';

    public function handle(RoiPayoutService $service): int
    {
        $weekKey = $this->option('week');
        if (! $weekKey) {
            $weekKey = now()->subWeek()->format('o-\WW');
        }

        $this->info("Running ROI payout for week {$weekKey}...");
        $run = $service->runForWeek($weekKey);
        $this->info("Status: {$run->status}");

        return $run->status === 'completed' ? self::SUCCESS : self::FAILURE;
    }
}
