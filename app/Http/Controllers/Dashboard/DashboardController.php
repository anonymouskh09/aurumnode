<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
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

        $activeUserPackage = $user->activeUserPackage;
        $activePackageCard = null;
        if ($activeUserPackage) {
            $activeUserPackage->load('package');
            $pkg = $activeUserPackage->package;
            $cap = $this->earningsService->getPackageCap($activeUserPackage);
            $totalEarnings = $this->earningsService->getTotalEarningsForPackage($activeUserPackage->id);
            $activePackageCard = [
                'display_name' => $pkg ? $pkg->getDisplayName() : $activeUserPackage->package->name ?? '—',
                'price' => (float) $activeUserPackage->invested_amount,
                'status' => $activeUserPackage->status,
                'cap' => round($cap, 2),
                'total_earnings' => round($totalEarnings, 2),
            ];
        }

        $earningsBalance = (float) $wallet->direct_bonus_wallet + (float) $wallet->binary_bonus_wallet
            + (float) $wallet->roi_wallet + (float) $wallet->rank_award_wallet;
        $investmentBalance = (float) ($wallet->investment_wallet ?? 0);

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
            'investmentBalance' => round($investmentBalance, 2),
            'earningsBalance' => round($earningsBalance, 2),
        ]);
    }
}
