<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CoinpaymentDepositIntent extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_AWAITING_PAYMENT = 'awaiting_payment';
    public const STATUS_PARTIAL = 'partial';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'user_id',
        'order_ref',
        'provider_txn_id',
        'amount_requested',
        'amount_received',
        'currency_requested',
        'currency_received',
        'pay_currency',
        'status',
        'status_message',
        'provider_payload',
        'credited_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_requested' => 'decimal:8',
            'amount_received' => 'decimal:8',
            'provider_payload' => 'array',
            'credited_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

