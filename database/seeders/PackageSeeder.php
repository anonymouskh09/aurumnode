<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

/**
 * Paid packages: Starter, Builder, Accelerator, Elite, Titan, Legacy.
 * Binary %: 100/500/1000 = 8%, 2500/5000 = 9%, 10000 (Legacy) = 10%.
 * Monthly ROI %: Starter 8, Builder 9, Accelerator 10, Elite 11, Titan 12, Legacy 12.
 */
class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            ['name' => 'Starter', 'price_usd' => 100, 'binary_percent' => 8, 'monthly_roi_rate' => 8],
            ['name' => 'Builder', 'price_usd' => 500, 'binary_percent' => 8, 'monthly_roi_rate' => 9],
            ['name' => 'Accelerator', 'price_usd' => 1000, 'binary_percent' => 8, 'monthly_roi_rate' => 10],
            ['name' => 'Elite', 'price_usd' => 2500, 'binary_percent' => 9, 'monthly_roi_rate' => 11],
            ['name' => 'Titan', 'price_usd' => 5000, 'binary_percent' => 9, 'monthly_roi_rate' => 12],
            ['name' => 'Legacy', 'price_usd' => 10000, 'binary_percent' => 10, 'monthly_roi_rate' => 12],
        ];

        foreach ($packages as $p) {
            Package::updateOrCreate(
                ['price_usd' => $p['price_usd']],
                [
                    'name' => $p['name'],
                    'display_name' => $p['name'],
                    'status' => 'active',
                    'is_leader' => false,
                    'is_admin_only' => false,
                    'roi_enabled' => true,
                    'monthly_roi_rate' => $p['monthly_roi_rate'],
                    'binary_percent' => $p['binary_percent'],
                    'pays_direct_bonus' => true,
                    'points_pass_up' => true,
                ]
            );
        }
    }
}
