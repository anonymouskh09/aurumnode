<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard with referral links.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $baseUrl = $request->getSchemeAndHttpHost();

        // Generate left and right referral links for this user
        $referralLinks = [
            'left' => $baseUrl.'/register?ref='.urlencode($user->username).'&side=left',
            'right' => $baseUrl.'/register?ref='.urlencode($user->username).'&side=right',
        ];

        return Inertia::render('Dashboard', [
            'referralLinks' => $referralLinks,
        ]);
    }
}
