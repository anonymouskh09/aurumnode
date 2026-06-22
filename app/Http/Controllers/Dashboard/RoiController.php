<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\RoiLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoiController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $logs = RoiLog::where('user_id', $user->id)
            ->with('userPackage.package:id,name')
            ->latest('date')
            ->latest('id')
            ->limit(100)
            ->get();

        $wallet = $user->wallet;
        $balance = $wallet ? (float) $wallet->roi_wallet : 0;
        $totalRoiReceived = $wallet ? (float) $wallet->total_roi : 0;

        return Inertia::render('Dashboard/Roi', [
            'logs' => $logs,
            'balance' => $balance,
            'totalRoiReceived' => round($totalRoiReceived, 2),
        ]);
    }
}
