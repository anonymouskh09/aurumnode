<?php

namespace App\Services;

use App\Models\Setting;

/**
 * Tiered withdrawal fee: below threshold vs at/above threshold (admin-configurable).
 */
class WithdrawalFeeService
{
    public function getSettings(): array
    {
        return [
            'threshold_usd' => (float) Setting::get('withdrawal_fee_threshold_usd', 100),
            'percent_below' => (float) Setting::get('withdrawal_fee_percent_below', 10),
            'percent_at_or_above' => (float) Setting::get('withdrawal_fee_percent_at_or_above', 3),
        ];
    }

    public function resolveFeePercent(float $amount): float
    {
        $settings = $this->getSettings();

        return $amount < $settings['threshold_usd']
            ? $settings['percent_below']
            : $settings['percent_at_or_above'];
    }

    /**
     * @return array{percent: float, fee_amount: float, total_deduct: float}
     */
    public function calculateForAmount(float $amount): array
    {
        $percent = $this->resolveFeePercent($amount);
        $feeAmount = round($amount * ($percent / 100), 2);

        return [
            'percent' => $percent,
            'fee_amount' => $feeAmount,
            'total_deduct' => round($amount + $feeAmount, 2),
        ];
    }
}
