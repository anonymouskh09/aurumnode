<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EarningsLedger extends Model
{
    public const TYPE_DIRECT = 'DIRECT';
    public const TYPE_BINARY = 'BINARY';
    public const TYPE_ROI = 'ROI';

    protected $table = 'earnings_ledger';

    protected $fillable = [
        'user_id',
        'user_package_id',
        'type',
        'amount',
        'ref_id',
        'payout_run_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userPackage(): BelongsTo
    {
        return $this->belongsTo(UserPackage::class);
    }

    public function payoutRun(): BelongsTo
    {
        return $this->belongsTo(PayoutRun::class);
    }
}
