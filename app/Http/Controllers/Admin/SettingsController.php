<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin-configurable settings: withdrawal rules, binary %, ROI, contract caps.
 * No hardcoded values; all editable from here.
 */
class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::getAllCached();
        $packages = Package::orderBy('price_usd')->get(['id', 'name', 'price_usd', 'roi_enabled', 'roi_weekly_percent']);

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'withdrawal_min_usd' => Setting::get('withdrawal_min_usd', 20),
                'withdrawal_fee_percent' => Setting::get('withdrawal_fee_percent', 2),
                'withdrawal_allowed_days' => Setting::get('withdrawal_allowed_days', [3, 4, 5]),
                'binary_bonus_percent' => Setting::get('binary_bonus_percent', 10),
                'binary_run_at_dubai_time' => Setting::get('binary_run_at_dubai_time', '00:00'),
                'roi_global_enabled' => (bool) Setting::get('roi_global_enabled', true),
                'roi_contract_cap_percent' => Setting::get('roi_contract_cap_percent', 250),
                'roi_distribution_mode' => Setting::get('roi_distribution_mode', 'weekly'),
                'contract_network_cap_multiplier' => Setting::get('contract_network_cap_multiplier', 5),
                'roi_package_rates' => Setting::get('roi_package_rates', []),
            ],
            'packages' => $packages,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'withdrawal_min_usd' => ['sometimes', 'numeric', 'min:0'],
            'withdrawal_fee_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'withdrawal_allowed_days' => ['sometimes', 'array'],
            'withdrawal_allowed_days.*' => ['integer', 'min:0', 'max:6'],
            'binary_bonus_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'binary_run_at_dubai_time' => ['sometimes', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'roi_global_enabled' => ['sometimes', 'boolean'],
            'roi_contract_cap_percent' => ['sometimes', 'numeric', 'min:100'],
            'roi_distribution_mode' => ['sometimes', 'in:weekly,manual'],
            'contract_network_cap_multiplier' => ['sometimes', 'numeric', 'min:1'],
            'roi_package_rates' => ['sometimes', 'array'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        // Update package roi_weekly_percent if sent
        if ($request->has('packages_roi')) {
            foreach ($request->input('packages_roi', []) as $id => $percent) {
                Package::where('id', $id)->update(['roi_weekly_percent' => $percent ?: null]);
            }
        }

        \App\Models\AuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => 'settings_updated',
            'payload' => array_keys($validated),
        ]);

        return back()->with('status', 'Settings saved.');
    }
}
