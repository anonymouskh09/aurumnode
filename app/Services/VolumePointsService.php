<?php

namespace App\Services;

use App\Models\Package;
use App\Models\User;
use App\Models\VolumePointsLog;
use Illuminate\Support\Facades\DB;

/**
 * Track volume points (1 USD = 1 point) for binary tree.
 * Points flow up the binary tree on the side of the purchaser.
 */
class VolumePointsService
{
    /**
     * Add volume points from package purchase up the binary tree.
     * 1 USD = 1 point. Points pass up on the side of the purchaser.
     */
    public function addPointsFromPurchase(User $buyer, float $amount, int $userPackageId): void
    {
        $package = $buyer->userPackages()->find($userPackageId)?->package;
        if ($package && ! $package->points_pass_up) {
            return; // Leader package - points don't pass up
        }

        $points = $amount;
        if ($points <= 0) {
            return;
        }

        $current = $buyer;
        $parent = $buyer->binaryParent ?? $buyer->sponsor;
        $today = now()->toDateString();

        while ($parent) {
            $side = $current->placement_side;
            if (! in_array($side, ['left', 'right'], true)) {
                break;
            }

            $column = $side === 'left' ? 'left_points_total' : 'right_points_total';
            $logColumn = $side === 'left' ? 'left_points' : 'right_points';

            DB::transaction(function () use ($parent, $points, $column, $logColumn, $today) {
                $parent->increment($column, $points);

                $log = VolumePointsLog::firstOrCreate(
                    ['user_id' => $parent->id, 'date' => $today],
                    ['left_points' => 0, 'right_points' => 0, 'source' => 'package_purchase']
                );
                $log->increment($logColumn, $points);
            });

            $current = $parent;
            $parent = $parent->binaryParent ?? $parent->sponsor;
        }
    }
}
