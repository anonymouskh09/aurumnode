<?php

namespace App\Console;

use App\Services\BinaryPayoutService;
use Illuminate\Console\Command;

class PayoutBinaryDailyCommand extends Command
{
    protected $signature = 'payout:binary-daily {--week= : Week key (e.g. 2026-W10), default previous week} {--date= : Legacy support: date mapped to ISO week}';

    protected $description = 'Run weekly binary bonus payout (idempotent).';

    public function handle(BinaryPayoutService $service): int
    {
        $weekKey = $this->option('week');
        $dateStr = $this->option('date');
        if (! $weekKey && $dateStr) {
            $weekKey = \Carbon\Carbon::parse($dateStr)->format('o-\WW');
        }
        if (! $weekKey) {
            $weekKey = now()->subWeek()->format('o-\WW');
        }

        $this->info("Running binary payout for week {$weekKey}...");
        $run = $service->runForWeek($weekKey);
        $this->info("Status: {$run->status}");

        return $run->status === 'completed' ? self::SUCCESS : self::FAILURE;
    }
}
