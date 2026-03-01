<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Admin-only: Activate Access Package (Leader) for a user.
 * Grants 1,000,000 power volume on specified leg. No ROI. Cap = $4,000.
 */
class LeaderActivationService
{
    public function activateByAdmin(
        User $user,
        User $admin,
        string $leg = 'left',
        ?float $overrideCapMultiplier = null
    ): UserPackage {
        $package = Package::where('is_leader', true)->where('name', 'like', '%Access%')->first()
            ?? Package::where('is_leader', true)->first();

        if (! $package || ! $package->is_admin_only) {
            throw new \RuntimeException('Access Package (Leader) not found or not admin-only');
        }

        $amount = (float) $package->price_usd; // 1000
        $multiplier = $overrideCapMultiplier ?? 4;
        $maxCap = round($amount * $multiplier, 2);

        return DB::transaction(function () use ($user, $admin, $package, $amount, $maxCap, $multiplier, $leg) {
            $userPackage = $user->userPackages()->create([
                'package_id' => $package->id,
                'invested_amount' => $amount,
                'activated_at' => now(),
                'status' => UserPackage::STATUS_ACTIVE,
                'max_cap' => $maxCap,
                'cap_multiplier' => $multiplier,
                'leader_activation_mode' => UserPackage::LEADER_MODE_ADMIN_GRANTED,
            ]);

            $user->update(['active_package_id' => $userPackage->id]);

            $points = (float) $package->power_leg_points; // 1,000,000
            if ($points > 0) {
                $col = $leg === 'right' ? 'right_points_total' : 'left_points_total';
                $logCol = $leg === 'right' ? 'right_points' : 'left_points';
                $user->increment($col, $points);
                VolumePointsLog::firstOrCreate(
                    ['user_id' => $user->id, 'date' => now()->toDateString()],
                    ['left_points' => 0, 'right_points' => 0, 'source' => 'leader_admin_grant']
                )->increment($logCol, $points);
            }

            AuditLog::create([
                'admin_id' => $admin->id,
                'target_user_id' => $user->id,
                'action' => 'leader_activation',
                'model_type' => UserPackage::class,
                'model_id' => $userPackage->id,
                'payload' => [
                    'user_package_id' => $userPackage->id,
                    'leg' => $leg,
                    'points_added' => $points,
                    'reason' => 'Admin granted Access Package',
                ],
            ]);

            return $userPackage;
        });
    }
}
