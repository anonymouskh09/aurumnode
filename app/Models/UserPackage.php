<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPackage extends Model
{
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_EXPIRED_BY_4X = 'EXPIRED_BY_4X';
    public const STATUS_ADMIN_DISABLED = 'ADMIN_DISABLED';

    public const LEADER_MODE_ADMIN_GRANTED = 'ADMIN_GRANTED';
    public const LEADER_MODE_SELF_PURCHASE = 'SELF_PURCHASE';

    protected $fillable = [
        'user_id',
        'package_id',
        'invested_amount',
        'activated_at',
        'expired_at',
        'locked_investment_released_at',
        'total_earned',
        'max_cap',
        'cap_multiplier',
        'leader_activation_mode',
        'renewal_required',
        'is_maxed_out',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'invested_amount' => 'decimal:2',
            'total_earned' => 'decimal:2',
            'max_cap' => 'decimal:2',
            'cap_multiplier' => 'decimal:2',
            'activated_at' => 'datetime',
            'expired_at' => 'datetime',
            'locked_investment_released_at' => 'datetime',
            'is_maxed_out' => 'boolean',
            'renewal_required' => 'boolean',
        ];
    }

    public function isEarning(): bool
    {
        return $this->status === self::STATUS_ACTIVE && ! $this->is_maxed_out;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
