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
        $user = $request->user();
        $packages = Package::where('status', 'active')
            ->where('is_admin_only', false)
            ->where('is_leader', false)
            ->orderBy('price_usd')
            ->get()
            ->map(fn ($p) => array_merge($p->toArray(), ['display_name' => $p->getDisplayName()]));

        $wallet = $this->walletService->getOrCreateWallet($user);
        $depositBalance = (float) $wallet->deposit_wallet;
        $withdrawalBalance = (float) $wallet->withdrawal_wallet;
        $highestPurchasedAmount = (float) $user->userPackages()->max('invested_amount');

        return Inertia::render('Dashboard/Packages', [
            'packages' => $packages,
            'deposit_balance_usdt' => round($depositBalance, 2),
            'withdrawal_balance_usdt' => round($withdrawalBalance, 2),
            'highest_purchased_amount' => round($highestPurchasedAmount, 2),
        ]);
    }

    /**
     * Buy package. Payment from Deposit Wallet or Withdrawal Wallet (USDT).
     */
    public function buy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,id'],
            'pay_from' => ['nullable', 'in:deposit_wallet,withdrawal_wallet'],
        ]);

        $package = Package::findOrFail($validated['package_id']);
        if ($package->status !== 'active') {
            return back()->withErrors(['package_id' => 'Package is not available.']);
        }
        if ($package->is_admin_only || $package->is_leader) {
            return back()->withErrors(['package_id' => 'This package can only be activated by admin.']);
        }

        $payFrom = $validated['pay_from'] ?? 'deposit_wallet';
        try {
            $this->packagePurchaseService->purchase($request->user(), $package, $payFrom);
        } catch (\RuntimeException $e) {
            return back()->withErrors([
                'package_id' => $e->getMessage(),
            ]);
        }

        return redirect()->route('dashboard.index')->with('status', 'Package purchased successfully.');
    }

    /**
     * Demo: add amount to current user's deposit wallet (for testing).
     */
    public function demoDeposit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:100000'],
        ]);

        $amount = (float) $validated['amount'];
        $this->walletService->addToDeposit($request->user(), $amount);

        return back()->with('status', 'Demo amount $'.number_format($amount, 2).' added to Deposit Wallet.');
    }
}
