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
        $search = trim((string) $request->input('search', ''));
        $user = null;
        $searchResults = collect();
        $searchMessage = null;

        if ($request->filled('user_id')) {
            $user = User::query()
                ->where('is_admin', false)
                ->find($request->user_id);

            if ($user) {
                $this->hydrateUserForVolume($user);
            } else {
                $searchMessage = 'User not found.';
            }
        }

        if ($search !== '' && ! $user) {
            $searchResults = User::query()
                ->where('is_admin', false)
                ->where(function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                })
                ->orderBy('username')
                ->limit(20)
                ->get(['id', 'username', 'name', 'email', 'left_points_total', 'right_points_total']);

            if ($searchResults->count() === 1) {
                $user = $searchResults->first();
                $this->hydrateUserForVolume($user);
                $searchResults = collect();
            } elseif ($searchResults->isEmpty() && ! $searchMessage) {
                $searchMessage = 'No users found. Try username, email, or name.';
            }
        }

        return Inertia::render('Admin/Volume/Index', [
            'user' => $user,
            'searchResults' => $searchResults->values(),
            'filters' => ['search' => $search],
            'searchMessage' => $searchMessage,
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

        $redirectParams = ['user_id' => $user->id];
        if ($request->filled('search')) {
            $redirectParams['search'] = $request->input('search');
        }

        return redirect()
            ->route('admin.volume.index', $redirectParams)
            ->with('status', 'Volume added.');
    }

    public function subtract(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'leg' => ['required', 'in:left,right'],
            'points' => ['required', 'numeric', 'min:0.01'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $this->volumeService->removeVolume(
            $user,
            $validated['leg'],
            (float) $validated['points'],
            $request->user(),
            $validated['reason'] ?? 'Manual remove by admin'
        );

        $redirectParams = ['user_id' => $user->id];
        if ($request->filled('search')) {
            $redirectParams['search'] = $request->input('search');
        }

        return redirect()
            ->route('admin.volume.index', $redirectParams)
            ->with('status', 'Volume removed.');
    }

    private function hydrateUserForVolume(User $user): void
    {
        $user->load('userPackages.package');
        $user->carry = $this->volumeService->getCarryTotals($user);
    }
}
