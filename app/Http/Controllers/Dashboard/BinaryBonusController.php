<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BinaryBonusLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BinaryBonusController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $logs = BinaryBonusLog::where('user_id', $user->id)
            ->latest('date')
            ->latest('id')
            ->limit(100)
            ->get();

        $total = BinaryBonusLog::where('user_id', $user->id)->sum('payout_amount');
        $wallet = $user->wallet;
        $balance = $wallet ? (float) $wallet->binary_bonus_wallet : 0;

        return Inertia::render('Dashboard/BinaryBonus', [
            'logs' => $logs,
            'totalEarned' => round((float) $total, 2),
            'balance' => $balance,
            'leftTotal' => (float) $user->left_points_total,
            'rightTotal' => (float) $user->right_points_total,
        ]);
    }
}
