<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $team = $request->user()
            ->referrals()
            ->with(['userPackages' => fn ($q) => $q->latest()->limit(1)->with('package')])
            ->get()
            ->map(function ($m) {
                $m->latest_package = $m->userPackages->first()?->package;
                return $m;
            });

        return Inertia::render('Dashboard/Team', [
            'team' => $team,
        ]);
    }
}
