<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\VolumeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Manually add volume points to user left/right leg.
 */
class VolumeController extends Controller
{
    public function __construct(
        private VolumeService $volumeService
    ) {}

    public function index(Request $request): Response
    {
        $user = null;
        if ($request->input('user_id')) {
            $user = User::find($request->user_id);
            if ($user) {
                $user->load('userPackages.package');
                $user->carry = $this->volumeService->getCarryTotals($user);
            }
        }

        return Inertia::render('Admin/Volume/Index', [
            'user' => $user,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'leg' => ['required', 'in:left,right'],
            'points' => ['required', 'numeric', 'min:0.01'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $this->volumeService->addVolume(
            $user,
            $validated['leg'],
            (float) $validated['points'],
            $request->user(),
            $validated['reason'] ?? 'Manual add by admin'
        );

        return back()->with('status', 'Volume added.');
    }
}
