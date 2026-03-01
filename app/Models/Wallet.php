<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'deposit_wallet',
        'investment_wallet',
        'withdrawal_wallet',
        'direct_bonus_wallet',
        'binary_bonus_wallet',
        'roi_wallet',
        'rank_award_wallet',
        'total_withdrawn',
        'total_roi',
        'total_bonus',
    ];

    protected function casts(): array
    {
        return [
            'deposit_wallet' => 'decimal:2',
            'investment_wallet' => 'decimal:2',
            'withdrawal_wallet' => 'decimal:2',
            'direct_bonus_wallet' => 'decimal:2',
            'binary_bonus_wallet' => 'decimal:2',
            'roi_wallet' => 'decimal:2',
            'rank_award_wallet' => 'decimal:2',
            'total_withdrawn' => 'decimal:2',
            'total_roi' => 'decimal:2',
            'total_bonus' => 'decimal:2',
        ];
    }

    /** Sum of all withdrawable earnings (direct + binary + roi + rank_award). */
    public function getEarningsBalanceAttribute(): float
    {
        return (float) $this->direct_bonus_wallet
            + (float) $this->binary_bonus_wallet
            + (float) $this->roi_wallet
            + (float) $this->rank_award_wallet;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
