<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name', 'display_name', 'price_usd', 'status',
        'is_leader', 'is_admin_only', 'power_leg_points',
        'roi_enabled', 'roi_weekly_percent', 'monthly_roi_rate', 'binary_percent',
        'pays_direct_bonus', 'points_pass_up',
    ];

    /** Display name for UI (admin can rename). Source of truth. */
    public function getDisplayName(): string
    {
        return (string) ($this->display_name ?? $this->name);
    }

    protected function casts(): array
    {
        return [
            'price_usd' => 'decimal:2',
            'power_leg_points' => 'decimal:2',
            'roi_weekly_percent' => 'decimal:2',
            'monthly_roi_rate' => 'decimal:2',
            'binary_percent' => 'decimal:2',
            'is_leader' => 'boolean',
            'is_admin_only' => 'boolean',
            'roi_enabled' => 'boolean',
            'pays_direct_bonus' => 'boolean',
            'points_pass_up' => 'boolean',
        ];
    }

    /** Weekly ROI rate = monthly_roi_rate / 4 (for weekly payout). */
    public function getWeeklyRoiRate(): float
    {
        $monthly = $this->monthly_roi_rate ?? 0;
        return (float) $monthly / 4;
    }

    /** Weekly ROI % (for display/legacy). */
    public function getWeeklyRoiPercent(): float
    {
        if ($this->roi_weekly_percent !== null) {
            return (float) $this->roi_weekly_percent;
        }
        return $this->getWeeklyRoiRate(); // monthly/4 as percent equivalent
    }

    /** Binary %: Starter/Builder/Accelerator 8%, Elite/Titan/Legacy 9%. Leader from package. */
    public function getBinaryPercent(): float
    {
        if ($this->binary_percent !== null) {
            return (float) $this->binary_percent;
        }
        $map = [
            100 => 8, 500 => 8, 1000 => 8,
            2500 => 9, 5000 => 9, 10000 => 10,
        ];
        return (float) ($map[(int) $this->price_usd] ?? 8);
    }

    public function userPackages(): HasMany
    {
        return $this->hasMany(UserPackage::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
