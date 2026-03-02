<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopController extends Controller
{
    /**
     * Top performers (admin only). By volume and by investment.
     */
    public function index(Request $request): Response
    {
        $topByVolume = User::whereNotNull('username')
            ->selectRaw('id, username, name, (left_points_total + right_points_total) as total_volume')
            ->orderByRaw('(left_points_total + right_points_total) DESC')
            ->limit(20)
            ->get();

        $topByInvestment = User::whereHas('userPackages')
            ->withSum('userPackages', 'invested_amount')
            ->orderByDesc('user_packages_sum_invested_amount')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Top', [
            'topByVolume' => $topByVolume,
            'topByInvestment' => $topByInvestment,
        ]);
    }
}
