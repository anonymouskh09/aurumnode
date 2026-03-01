<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EarningsLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Earnings ledger viewer with filters.
 */
class EarningsLedgerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EarningsLedger::with(['user:id,name,username,email', 'userPackage.package:id,name,price_usd']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $ledger = $query->latest()->paginate(50)->withQueryString();
        $totals = [
            'DIRECT' => EarningsLedger::where('type', 'DIRECT')->sum('amount'),
            'BINARY' => EarningsLedger::where('type', 'BINARY')->sum('amount'),
            'ROI' => EarningsLedger::where('type', 'ROI')->sum('amount'),
        ];

        return Inertia::render('Admin/EarningsLedger/Index', [
            'ledger' => $ledger,
            'totals' => $totals,
            'filters' => $request->only(['user_id', 'type', 'from', 'to']),
        ]);
    }
}
