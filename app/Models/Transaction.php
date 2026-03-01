<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public const TYPE_TRANSFER = 'transfer';
    public const TYPE_WITHDRAWAL_REQUEST = 'withdrawal_request';
    public const TYPE_PACKAGE_PURCHASE = 'package_purchase';

    protected $fillable = ['user_id', 'type', 'amount', 'meta_json'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'meta_json' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
