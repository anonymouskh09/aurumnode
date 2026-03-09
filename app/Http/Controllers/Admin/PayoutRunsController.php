<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayoutRun;
use App\Models\UserPackage;
use App\Models\VolumePointsLog;
use App\Services\BinaryPayoutService;
use App\Services\RoiPayoutService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Payout runs viewer (binary_daily / roi_weekly) with status.
 * Manual trigger: Run Binary / Run ROI buttons (no need to wait for cron).
 */
class PayoutRunsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PayoutRun::query();
        if ($request->filled('run_type')) {
            $query->where('run_type', $request->run_type);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        $runs = $query->latest()->paginate(30)->withQueryString();

        return Inertia::render('Admin/PayoutRuns/Index', [
            'runs' => $runs,
            'filters' => $request->only(['run_type', 'status']),
        ]);
    }

    /**
     * Run binary payout catch-up until current week (idempotent per week).
     */
    public function runBinary(BinaryPayoutService $service): RedirectResponse
    {
        $currentWeekStart = now()->startOfWeek();
        $firstVolumeDate = VolumePointsLog::query()->min('date');
        $startWeek = $firstVolumeDate
            ? Carbon::parse($firstVolumeDate)->startOfWeek()
            : $currentWeekStart->copy();

        $week = $startWeek->copy();
        $processed = 0;
        while ($week->lte($currentWeekStart)) {
            $service->runForWeek($week->format('o-\WW'));
            $processed++;
            $week->addWeek();
        }

        return back()->with('status', "Binary payout catch-up done ({$processed} week(s) up to current week).");
    }

    /**
     * Run ROI payout catch-up until current week (idempotent per week).
     */
    public function runRoi(RoiPayoutService $service): RedirectResponse
    {
        $currentWeekStart = now()->startOfWeek();
        $firstActivatedAt = UserPackage::query()->min('activated_at');
        $startWeek = $firstActivatedAt
            ? Carbon::parse($firstActivatedAt)->startOfWeek()
            : $currentWeekStart->copy();

        $week = $startWeek->copy();
        $processed = 0;
        while ($week->lte($currentWeekStart)) {
            $service->runForWeek($week->format('o-\WW'));
            $processed++;
            $week->addWeek();
        }

        return back()->with('status', "ROI payout catch-up done ({$processed} week(s) up to current week).");
    }
}
