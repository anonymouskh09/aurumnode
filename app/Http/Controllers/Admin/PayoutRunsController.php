<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayoutRun;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Payout runs viewer (binary_daily / roi_weekly) with status.
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
}
