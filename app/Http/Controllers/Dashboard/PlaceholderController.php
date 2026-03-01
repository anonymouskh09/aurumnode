<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlaceholderController extends Controller
{
    public function __invoke(Request $request, string $page): Response
    {
        $titles = [
            'direct-bonus' => 'Direct Bonus',
            'binary-bonus' => 'Binary Bonus',
            'roi' => 'My ROI',
            'rank' => 'My Rank',
            'top' => 'Top',
        ];

        return Inertia::render('Dashboard/Placeholder', [
            'title' => $titles[$page] ?? 'Coming Soon',
        ]);
    }
}
