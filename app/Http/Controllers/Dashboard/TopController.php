<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopController extends Controller
{
    public function index(Request $request): Response
    {
        // Top by total volume (left + right points)
        $topByVolume = User::whereNotNull('username')
            ->selectRaw('id, username, name, (left_points_total + right_points_total) as total_volume')
            ->orderByRaw('(left_points_total + right_points_total) DESC')
            ->limit(20)
            ->get();

        // Top by investment (user_packages sum)
        $topByInvestment = User::whereHas('userPackages')
            ->withSum('userPackages', 'invested_amount')
            ->orderByDesc('user_packages_sum_invested_amount')
            ->limit(20)
            ->get();

        return Inertia::render('Dashboard/Top', [
            'topByVolume' => $topByVolume,
            'topByInvestment' => $topByInvestment,
        ]);
    }
}
