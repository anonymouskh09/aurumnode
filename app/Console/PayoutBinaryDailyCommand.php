<?php

namespace App\Console;

use App\Services\BinaryPayoutService;
use Illuminate\Console\Command;

class PayoutBinaryDailyCommand extends Command
{
    protected $signature = 'payout:binary-daily {--date= : Date (Y-m-d), default yesterday}';

    protected $description = 'Run daily binary bonus payout (idempotent).';

    public function handle(BinaryPayoutService $service): int
    {
        $dateStr = $this->option('date');
        $date = $dateStr ? \Carbon\Carbon::parse($dateStr) : now()->subDay();
        $date = $date->startOfDay();

        $this->info("Running binary payout for {$date->format('Y-m-d')}...");
        $run = $service->runForDate($date);
        $this->info("Status: {$run->status}");

        return $run->status === 'completed' ? self::SUCCESS : self::FAILURE;
    }
}
