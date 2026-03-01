<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DirectBonusLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DirectBonusController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $logs = DirectBonusLog::where('user_id', $user->id)
            ->with('fromUser:id,name,username')
            ->latest()
            ->limit(100)
            ->get();

        $total = DirectBonusLog::where('user_id', $user->id)->sum('amount');
        $wallet = $user->wallet;
        $balance = $wallet ? (float) $wallet->direct_bonus_wallet : 0;

        return Inertia::render('Dashboard/DirectBonus', [
            'logs' => $logs,
            'totalEarned' => round((float) $total, 2),
            'balance' => $balance,
        ]);
    }
}
