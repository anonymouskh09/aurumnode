<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Package management - create/edit, binary %, monthly ROI, toggles.
 */
class PackagesController extends Controller
{
    public function index(): Response
    {
        $packages = Package::orderBy('price_usd')->get()->map(fn ($p) => array_merge($p->toArray(), ['display_name' => $p->getDisplayName()]));

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
        ]);
    }

    public function edit(Package $package): Response
    {
        return Inertia::render('Admin/Packages/Edit', [
            'package' => $package,
        ]);
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'price_usd' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:active,inactive'],
            'binary_percent' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'monthly_roi_rate' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'roi_enabled' => ['sometimes', 'boolean'],
            'pays_direct_bonus' => ['sometimes', 'boolean'],
            'is_admin_only' => ['sometimes', 'boolean'],
        ]);

        $package->update($validated);

        AuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => 'package_updated',
            'model_type' => Package::class,
            'model_id' => $package->id,
            'payload' => $validated,
        ]);

        return redirect()->route('admin.packages.index')->with('status', 'Package updated.');
    }
}
