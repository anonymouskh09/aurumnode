<?php

namespace App\Jobs;

use App\Services\BinaryBonusService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RunDailyBinaryPayoutJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ?string $date = null
    ) {
        // Default to yesterday in Dubai - job runs at 12 AM Dubai, process previous day's points
        $this->date = $date ?? \Carbon\Carbon::now('Asia/Dubai')->subDay()->toDateString();
    }

    public function handle(BinaryBonusService $service): void
    {
        $service->runDailyPayout(new \DateTime($this->date));
    }
}
