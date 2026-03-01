<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BinaryBonusLog extends Model
{
    protected $fillable = [
        'user_id', 'date', 'left_points', 'right_points', 'lesser_points',
        'percent_used', 'payout_amount', 'carried_left', 'carried_right', 'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'left_points' => 'decimal:2',
            'right_points' => 'decimal:2',
            'lesser_points' => 'decimal:2',
            'percent_used' => 'decimal:2',
            'payout_amount' => 'decimal:2',
            'carried_left' => 'decimal:2',
            'carried_right' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
