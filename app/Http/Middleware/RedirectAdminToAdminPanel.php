<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirect admin users away from user dashboard to admin panel.
 * Admin can only access /admin, not /dashboard.
 */
class RedirectAdminToAdminPanel
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isAdmin()) {
            return redirect()->route('admin.index');
        }

        return $next($request);
    }
}
