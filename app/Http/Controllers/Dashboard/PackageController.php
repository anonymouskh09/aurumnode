<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Services\PackagePurchaseService;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function __construct(
        private PackagePurchaseService $packagePurchaseService,
        private WalletService $walletService
    ) {}

    public function index(Request $request): Response
    {
        $packages = Package::where('status', 'active')
            ->where('is_admin_only', false)
            ->where('is_leader', false)
            ->orderBy('price_usd')
            ->get()
            ->map(fn ($p) => array_merge($p->toArray(), ['display_name' => $p->getDisplayName()]));

        $wallet = $this->walletService->getOrCreateWallet($request->user());
        $depositBalance = (float) $wallet->deposit_wallet;

        return Inertia::render('Dashboard/Packages', [
            'packages' => $packages,
            'deposit_balance_usdt' => round($depositBalance, 2),
        ]);
    }

    /**
     * Buy package. Payment is deducted from Deposit Wallet (USDT), including funds transferred from other users.
     */
    public function buy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,id'],
        ]);

        $package = Package::findOrFail($validated['package_id']);
        if ($package->status !== 'active') {
            return back()->withErrors(['package_id' => 'Package is not available.']);
        }
        if ($package->is_admin_only || $package->is_leader) {
            return back()->withErrors(['package_id' => 'This package can only be activated by admin.']);
        }

        $this->packagePurchaseService->purchase($request->user(), $package);

        return redirect()->route('dashboard.index')->with('status', 'Package purchased successfully.');
    }
}
