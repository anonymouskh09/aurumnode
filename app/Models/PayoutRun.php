<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayoutRun extends Model
{
    public const TYPE_BINARY_DAILY = 'binary_daily';
    public const TYPE_BINARY_WEEKLY = 'binary_weekly';
    public const TYPE_ROI_WEEKLY = 'roi_weekly';

    public const STATUS_PENDING = 'pending';
    public const STATUS_RUNNING = 'running';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'run_type',
        'period_key',
        'started_at',
        'finished_at',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    public function earningsLedger(): HasMany
    {
        return $this->hasMany(EarningsLedger::class, 'payout_run_id');
    }
}
