<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Services\PackagePurchaseService;
use App\Services\WalletService;
use Carbon\Carbon;
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
        $latestByPackage = $user->userPackages()
            ->select('package_id')
            ->selectRaw('MAX(COALESCE(activated_at, created_at)) as last_same_package_at')
            ->groupBy('package_id')
            ->pluck('last_same_package_at', 'package_id');

        $packages = Package::where('status', 'active')
            ->where('is_admin_only', false)
            ->where('is_leader', false)
            ->orderBy('price_usd')
            ->get()
            ->map(function ($p) use ($latestByPackage) {
                $lastSamePackageAt = $latestByPackage->get($p->id);
                $cooldownEndsAt = $lastSamePackageAt ? Carbon::parse($lastSamePackageAt)->addDays(7) : null;
                $cooldownActive = $cooldownEndsAt ? $cooldownEndsAt->isFuture() : false;
                $remainingHours = $cooldownActive ? max(1, now()->diffInHours($cooldownEndsAt, false)) : 0;
                $remainingDays = $cooldownActive ? (int) ceil($remainingHours / 24) : 0;

                return array_merge($p->toArray(), [
                    'display_name' => $p->getDisplayName(),
                    'same_package_cooldown_active' => $cooldownActive,
                    'same_package_cooldown_remaining_days' => $remainingDays,
                    'same_package_cooldown_ends_at' => $cooldownEndsAt?->toDateTimeString(),
                    'same_package_rebuy_available' => ! $cooldownActive && (bool) $lastSamePackageAt,
                ]);
            });

        $wallet = $this->walletService->getOrCreateWallet($request->user());
        $depositBalance = (float) $wallet->deposit_wallet;
        $withdrawalBalance = (float) $wallet->withdrawal_wallet;

        return Inertia::render('Dashboard/Packages', [
            'packages' => $packages,
            'deposit_balance_usdt' => round($depositBalance, 2),
            'withdrawal_balance_usdt' => round($withdrawalBalance, 2),
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
