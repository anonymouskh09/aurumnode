<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Transaction;
use App\Services\EarningsService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private WalletService $walletService,
        private EarningsService $earningsService
    ) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        $baseUrl = $request->getSchemeAndHttpHost();

        $totalInvestment = $user->userPackages()->sum('invested_amount');
        $totalVolumeUsdt = (float) $user->left_points_total + (float) $user->right_points_total;

        // All user packages with cap and earnings (for ROI / cap display)
        $userPackages = $user->userPackages()->with('package')->orderByDesc('activated_at')->get();
        $packageCards = [];
        $totalCap = 0.0;
        $totalEarningsFromPackages = 0.0;
        foreach ($userPackages as $up) {
            $pkg = $up->package;
            $cap = $this->earningsService->getPackageCap($up);
            $earnings = $this->earningsService->getTotalEarningsForPackage($up->id);
            $totalCap += $cap;
            $totalEarningsFromPackages += $earnings;
            $packageCards[] = [
                'id' => $up->id,
                'display_name' => $pkg ? $pkg->getDisplayName() : $up->package->name ?? '—',
                'price' => (float) $up->invested_amount,
                'status' => $up->status,
                'cap' => round($cap, 2),
                'total_earnings' => round($earnings, 2),
                'is_active' => (int) $user->active_package_id === (int) $up->id,
            ];
        }

        // Keep first active package for backward compatibility (single card summary)
        $activePackageCard = null;
        if ($packageCards !== []) {
            $firstActive = collect($packageCards)->firstWhere('is_active', true) ?? $packageCards[0];
            $activePackageCard = [
                'display_name' => $firstActive['display_name'],
                'price' => $firstActive['price'],
                'status' => $firstActive['status'],
                'cap' => $firstActive['cap'],
                'total_earnings' => $firstActive['total_earnings'],
            ];
        }

        $earningsBalance = (float) $wallet->direct_bonus_wallet + (float) $wallet->binary_bonus_wallet
            + (float) $wallet->roi_wallet + (float) $wallet->rank_award_wallet
            + (float) $wallet->withdrawal_wallet;
        $investmentBalance = (float) ($wallet->investment_wallet ?? 0);
        $sentToUsersFromWithdrawal = (float) $user->transactions()
            ->where('type', Transaction::TYPE_TRANSFER)
            ->where('amount', '<', 0)
            ->where('meta_json->from', 'withdrawal_wallet')
            ->sum('amount');
        $withdrawalRequestedAmount = (float) $user->transactions()
            ->where('type', Transaction::TYPE_WITHDRAWAL_REQUEST)
            ->where('amount', '<', 0)
            ->sum('amount');
        $totalWithdrawnOut = abs($sentToUsersFromWithdrawal) + abs($withdrawalRequestedAmount);

        $referralLinks = [
            'left' => $baseUrl.'/register?ref='.urlencode($user->username).'&side=left',
            'right' => $baseUrl.'/register?ref='.urlencode($user->username).'&side=right',
        ];

        return Inertia::render('Dashboard/Index', [
            'referralLinks' => $referralLinks,
            'wallet' => $wallet,
            'totalInvestment' => number_format((float) $totalInvestment, 2, '.', ''),
            'totalVolumeUsdt' => round($totalVolumeUsdt, 2),
            'activePackageCard' => $activePackageCard,
            'packageCards' => $packageCards,
            'totalCap' => round($totalCap, 2),
            'totalEarningsFromPackages' => round($totalEarningsFromPackages, 2),
            'investmentBalance' => round($investmentBalance, 2),
            'earningsBalance' => round($earningsBalance, 2),
            'withdrawnOutAmount' => round($totalWithdrawnOut, 2),
            'directBonusPercent' => (float) Setting::get('direct_bonus_percent', 10),
        ]);
    }
}
