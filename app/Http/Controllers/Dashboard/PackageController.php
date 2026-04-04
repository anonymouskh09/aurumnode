<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CoinpaymentDepositIntent;
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
        $recentDepositIntents = CoinpaymentDepositIntent::where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get(['id', 'order_ref', 'amount_requested', 'amount_received', 'pay_currency', 'status', 'status_message', 'created_at'])
            ->map(fn ($intent) => [
                'id' => $intent->id,
                'order_ref' => $intent->order_ref,
                'amount_requested' => round((float) $intent->amount_requested, 8),
                'amount_received' => round((float) $intent->amount_received, 8),
                'pay_currency' => $intent->pay_currency,
                'status' => $intent->status,
                'status_message' => $intent->status_message,
                'created_at' => optional($intent->created_at)->toDateTimeString(),
            ])
            ->values();

        return Inertia::render('Dashboard/Packages', [
            'packages' => $packages,
            'deposit_balance_usdt' => round($depositBalance, 2),
            'withdrawal_balance_usdt' => round($withdrawalBalance, 2),
            'highest_purchased_amount' => round($highestPurchasedAmount, 2),
            'coinpayments_min_deposit' => (float) config('services.coinpayments.min_deposit', 10),
            'coinpayments_allowed_pay_currencies' => config('services.coinpayments.allowed_pay_currencies', []),
            'coinpayments_default_pay_currency' => (string) config('services.coinpayments.default_pay_currency', 'USDT.TRC20'),
            'coinpayments_enabled' => (bool) config('services.coinpayments.enabled', false),
            'recent_deposit_intents' => $recentDepositIntents,
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

}
