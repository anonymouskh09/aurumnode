<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayoutRun;
use App\Services\BinaryPayoutService;
use App\Services\RoiPayoutService;
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
     * Run binary payout now (previous week). Idempotent.
     */
    public function runBinary(BinaryPayoutService $service): RedirectResponse
    {
        $weekKey = now()->subWeek()->format('o-\WW');
        $run = $service->runForWeek($weekKey);

        return back()->with('status', "Binary payout for {$weekKey}: {$run->status}");
    }

    /**
     * Run ROI payout now (previous week). Idempotent.
     */
    public function runRoi(RoiPayoutService $service): RedirectResponse
    {
        $weekKey = now()->subWeek()->format('o-\WW');
        $run = $service->runForWeek($weekKey);

        return back()->with('status', "ROI payout for {$weekKey}: {$run->status}");
    }
}
