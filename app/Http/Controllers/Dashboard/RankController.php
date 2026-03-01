<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RankController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $currentRank = $user->userRanks()->orderByDesc('ranks.level')->first();
        $nextRank = Rank::where('level', '>', $currentRank?->level ?? 0)->orderBy('level')->first();
        $lesserSide = min((float) $user->left_points_total, (float) $user->right_points_total);

        return Inertia::render('Dashboard/Rank', [
            'currentRank' => $currentRank,
            'nextRank' => $nextRank,
            'lesserSide' => $lesserSide,
        ]);
    }
}
