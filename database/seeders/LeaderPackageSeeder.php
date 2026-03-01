<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

/**
 * Access Package (Leader): $1,000 reference, 1,000,000 power volume points.
 * Admin-only activation. No ROI. Cap = 4X = $4,000.
 */
class LeaderPackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::updateOrCreate(
            ['name' => 'Access Package (Leader)'],
            [
                'display_name' => 'Access Package',
                'price_usd' => 1000,
                'status' => 'active',
                'is_leader' => true,
                'is_admin_only' => true,
                'power_leg_points' => 1000000,
                'roi_enabled' => false,
                'monthly_roi_rate' => 0,
                'binary_percent' => null,
                'pays_direct_bonus' => true,
                'points_pass_up' => false,
            ]
        );
    }
}
