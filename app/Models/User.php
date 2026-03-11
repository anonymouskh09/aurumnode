<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public const STATUS_FREE = 'free';
    public const STATUS_PAID = 'paid';

    public const PLACEMENT_LEFT = 'left';
    public const PLACEMENT_RIGHT = 'right';

    public const CYCLE_STATUS_ACTIVE = 'ACTIVE';
    public const CYCLE_STATUS_MAXED_OUT = 'MAXED_OUT';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'mobile',
        'country',
        'city',
        'address',
        'password',
        'transaction_password',
        'usdt_address',
        'sponsor_id',
        'placement_side',
        'left_child_id',
        'right_child_id',
        'binary_parent_id',
        'left_points_total',
        'right_points_total',
        'active_package_id',
        'left_carry_total',
        'right_carry_total',
        'cycle_status',
        'highest_package_price_in_cycle',
        'maxout_highest_package_price',
        'total_investment_in_cycle',
        'total_cap_in_cycle',
        'total_earned_in_cycle',
        'renewal_min_price',
        'status',
        'is_admin',
        'is_blocked',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'transaction_password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'transaction_password' => 'hashed',
            'left_points_total' => 'decimal:2',
            'right_points_total' => 'decimal:2',
            'highest_package_price_in_cycle' => 'decimal:2',
            'maxout_highest_package_price' => 'decimal:2',
            'total_investment_in_cycle' => 'decimal:2',
            'total_cap_in_cycle' => 'decimal:2',
            'total_earned_in_cycle' => 'decimal:2',
            'renewal_min_price' => 'decimal:2',
            'is_admin' => 'boolean',
            'is_blocked' => 'boolean',
        ];
    }

    /**
     * Sponsor (referrer) who invited this user.
     */
    public function sponsor()
    {
        return $this->belongsTo(User::class, 'sponsor_id');
    }

    /**
     * Users referred by this user (downline / direct team).
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'sponsor_id');
    }

    public function wallet()
    {
        return $this->hasOne(\App\Models\Wallet::class);
    }

    public function userPackages()
    {
        return $this->hasMany(\App\Models\UserPackage::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(\App\Models\Withdrawal::class);
    }

    public function transactions()
    {
        return $this->hasMany(\App\Models\Transaction::class);
    }

    public function kycDocuments()
    {
        return $this->hasMany(\App\Models\KycDocument::class);
    }

    public function binaryParent()
    {
        return $this->belongsTo(User::class, 'binary_parent_id');
    }

    public function leftChild()
    {
        return $this->belongsTo(User::class, 'left_child_id');
    }

    public function rightChild()
    {
        return $this->belongsTo(User::class, 'right_child_id');
    }

    public function userRanks()
    {
        return $this->belongsToMany(\App\Models\Rank::class, 'user_ranks')->withPivot('achieved_at')->withTimestamps();
    }

    public function heldEarnings()
    {
        return $this->hasMany(\App\Models\HeldEarning::class);
    }

    public function activeUserPackage()
    {
        return $this->belongsTo(UserPackage::class, 'active_package_id');
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }
}
