<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Default admin-configurable settings. All values editable from admin panel.
 */
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Withdrawals (any day by default; admin can restrict days)
            'withdrawal_min_usd' => '20',
            'withdrawal_fee_percent' => '2',
            'withdrawal_allowed_days' => json_encode([0, 1, 2, 3, 4, 5, 6]), // All days = any time
            'kyc_required_for_withdrawal' => '0', // When 1, user must have approved KYC to withdraw
            // Binary
            'binary_bonus_percent' => '10',
            'binary_run_at_dubai_time' => '00:00', // 12 AM Dubai
            // ROI
            'roi_global_enabled' => '1',
            'roi_contract_cap_percent' => '250',   // 250% of investment = contract expires
            'roi_distribution_mode' => 'weekly',  // weekly
            // Network / contract
            'contract_network_cap_multiplier' => '5', // 5X investment then must buy new package
        ];

        foreach ($defaults as $key => $value) {
            Setting::set($key, $value, $this->groupFor($key));
        }

        // Package-wise weekly ROI % (keyed by price_usd for simplicity; admin can override per package later)
        $roiRates = [
            100 => 2,
            500 => 2.25,
            1000 => 2.5,
            2500 => 2.75,
            5000 => 3,
            10000 => 3,
        ];
        Setting::set('roi_package_rates', $roiRates, 'roi');
    }

    private function groupFor(string $key): string
    {
        if (str_starts_with($key, 'withdrawal_')) {
            return 'withdrawal';
        }
        if (str_starts_with($key, 'binary_')) {
            return 'binary';
        }
        if (str_starts_with($key, 'roi_') || str_starts_with($key, 'contract_')) {
            return 'roi';
        }
        return 'general';
    }
}
