<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Track volume points and support manual admin adds (e.g. leader 1M support).
 */
class VolumeService
{
    /**
     * Add volume points to a user's left or right leg. Optionally log reason for audit.
     */
    public function addVolume(User $user, string $leg, float $points, ?User $admin = null, string $reason = ''): void
    {
        if (! in_array($leg, ['left', 'right'], true) || $points <= 0) {
            throw new \InvalidArgumentException('Invalid leg or points');
        }

        $col = $leg === 'right' ? 'right_points_total' : 'left_points_total';
        $logCol = $leg === 'right' ? 'right_points' : 'left_points';

        DB::transaction(function () use ($user, $leg, $points, $col, $logCol, $admin, $reason) {
            $user->increment($col, $points);
            VolumePointsLog::firstOrCreate(
                ['user_id' => $user->id, 'date' => now()->toDateString()],
                ['left_points' => 0, 'right_points' => 0, 'source' => 'manual']
            )->increment($logCol, $points);

            if ($admin) {
                AuditLog::create([
                    'admin_id' => $admin->id,
                    'target_user_id' => $user->id,
                    'action' => 'volume_add',
                    'payload' => [
                        'leg' => $leg,
                        'points' => $points,
                        'reason' => $reason ?: 'Manual volume add',
                    ],
                ]);
            }
        });
    }

    /**
     * Get current carry totals for a user (for admin viewer).
     */
    public function getCarryTotals(User $user): array
    {
        return [
            'left_carry_total' => (float) $user->left_carry_total,
            'right_carry_total' => (float) $user->right_carry_total,
        ];
    }
}
