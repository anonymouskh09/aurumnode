<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BinaryBonusLog;
use App\Models\DirectBonusLog;
use App\Models\KycDocument;
use App\Models\Package;
use App\Models\RoiLog;
use App\Models\User;
use App\Models\Withdrawal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Full-featured admin dashboard: members, sales, bonuses, ROI, withdrawals, KYC.
 * All metrics filterable by date, package, rank, member status.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $dateFrom = $request->input('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());
        $packageId = $request->input('package_id');
        $rankId = $request->input('rank_id');
        $memberStatus = $request->input('member_status'); // free | paid | blocked

        $start = Carbon::parse($dateFrom)->startOfDay();
        $end = Carbon::parse($dateTo)->endOfDay();
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();

        // Base user query for filters (for member counts and filtered metrics)
        $userQuery = User::query()->where('is_admin', false);
        if ($memberStatus !== null && $memberStatus !== '') {
            if ($memberStatus === 'blocked') {
                $userQuery->where('is_blocked', true);
            } else {
                $userQuery->where('status', $memberStatus)->where('is_blocked', false);
            }
        }
        if ($rankId) {
            $userQuery->whereHas('userRanks', fn ($q) => $q->where('ranks.id', $rankId));
        }

        // Members
        $totalFreeMembers = (clone $userQuery)->where('status', User::STATUS_FREE)->count();
        $totalPaidMembers = (clone $userQuery)->where('status', User::STATUS_PAID)->count();
        $totalBlocked = User::where('is_admin', false)->where('is_blocked', true)->count();

        // Sales: from user_packages (invested_amount)
        $salesQuery = \App\Models\UserPackage::query()
            ->whereHas('user', fn ($q) => $q->where('is_admin', false));
        if ($packageId) {
            $salesQuery->where('package_id', $packageId);
        }
        $totalSales = (clone $salesQuery)->sum('invested_amount');
        $salesToday = (clone $salesQuery)->whereDate('activated_at', today())->sum('invested_amount');
        $salesInRange = (clone $salesQuery)->whereBetween('activated_at', [$start, $end])->sum('invested_amount');

        // Package-wise sales (in date range)
        $packageWiseSales = Package::query()
            ->get()
            ->map(function ($p) use ($start, $end) {
                $total = $p->userPackages()->whereBetween('activated_at', [$start, $end])->sum('invested_amount');
                return ['id' => $p->id, 'name' => $p->name, 'total_sales' => (float) $total];
            });

        // Withdrawals
        $pendingWithdrawals = Withdrawal::where('status', 'pending')->count();
        $pendingWithdrawalsAmount = Withdrawal::where('status', 'pending')->sum('amount');
        $approvedWithdrawals = Withdrawal::where('status', 'approved')->count();
        $approvedWithdrawalsAmount = Withdrawal::where('status', 'approved')->sum('amount');

        // ROI this week
        $totalRoiThisWeek = RoiLog::whereBetween('date', [$weekStart, $weekEnd])->sum('amount');

        // Direct bonus total
        $totalDirectBonus = DirectBonusLog::sum('amount');

        // Binary bonus
        $totalBinaryBonus = BinaryBonusLog::sum('payout_amount');
        $binaryBonusThisWeek = BinaryBonusLog::whereBetween('date', [$weekStart, $weekEnd])->sum('payout_amount');

        // Rank holders (users with at least one rank)
        $rankHoldersCount = User::where('is_admin', false)->whereHas('userRanks')->count();

        // KYC
        $kycPendingCount = KycDocument::where('status', 'pending')->count();

        $packages = Package::orderBy('price_usd')->get(['id', 'name', 'price_usd']);
        $ranks = \App\Models\Rank::orderBy('level')->get(['id', 'name', 'level']);

        return Inertia::render('Admin/Dashboard', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'package_id' => $packageId,
                'rank_id' => $rankId,
                'member_status' => $memberStatus,
            ],
            'members' => [
                'total_free' => $totalFreeMembers,
                'total_paid' => $totalPaidMembers,
                'total_blocked' => $totalBlocked,
            ],
            'sales' => [
                'total' => round($totalSales, 2),
                'today' => round($salesToday, 2),
                'in_range' => round($salesInRange, 2),
            ],
            'package_wise_sales' => $packageWiseSales,
            'withdrawals' => [
                'pending_count' => $pendingWithdrawals,
                'pending_amount' => round((float) $pendingWithdrawalsAmount, 2),
                'approved_count' => $approvedWithdrawals,
                'approved_amount' => round((float) $approvedWithdrawalsAmount, 2),
            ],
            'roi_this_week' => round((float) $totalRoiThisWeek, 2),
            'direct_bonus_total' => round((float) $totalDirectBonus, 2),
            'binary_bonus_total' => round((float) $totalBinaryBonus, 2),
            'binary_bonus_this_week' => round((float) $binaryBonusThisWeek, 2),
            'rank_holders_count' => $rankHoldersCount,
            'kyc_pending_count' => $kycPendingCount,
            'packages' => $packages,
            'ranks' => $ranks,
        ]);
    }
}
