<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\EarningsLedger;
use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use App\Services\LeaderActivationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: User package controls - activate/deactivate/expire, cap override, pause, Access Package.
 */
class UserPackageControlsController extends Controller
{
    public function __construct(
        private LeaderActivationService $leaderActivationService
    ) {}

    public function index(Request $request): Response
    {
        $members = User::where('is_admin', false)
            ->with(['activeUserPackage.package', 'userPackages.package', 'sponsor:id,username,name'])
            ->when($request->input('q'), fn ($q) => $q->where('username', 'like', '%'.$request->q.'%')->orWhere('email', 'like', '%'.$request->q.'%'))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/UserPackageControls/Index', [
            'members' => $members,
        ]);
    }

    public function show(User $member): Response
    {
        $member->load(['userPackages.package', 'wallet']);
        $ledgerTotal = EarningsLedger::whereIn('user_package_id', $member->userPackages->pluck('id'))->sum('amount');

        return Inertia::render('Admin/UserPackageControls/Show', [
            'member' => $member,
            'ledgerTotal' => round($ledgerTotal, 2),
        ]);
    }

    public function activateAccessPackage(Request $request, User $member): RedirectResponse
    {
        $validated = $request->validate([
            'leg' => ['required', 'in:left,right'],
            'cap_multiplier' => ['nullable', 'numeric', 'min:1', 'max:20'],
        ]);
        $leg = $validated['leg'];
        $capMultiplier = $validated['cap_multiplier'] ?? null;

        $this->leaderActivationService->activateByAdmin(
            $member,
            $request->user(),
            $leg,
            $capMultiplier
        );

        return back()->with('status', 'Access Package activated. 1,000,000 USDT volume added to '.$leg.' leg.');
    }

    public function updateUserPackage(Request $request, UserPackage $userPackage): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:active,paused,EXPIRED_BY_4X,ADMIN_DISABLED'],
            'cap_multiplier' => ['sometimes', 'nullable', 'numeric', 'min:1', 'max:20'],
        ]);

        $userPackage->update(array_filter($validated));

        AuditLog::create([
            'admin_id' => $request->user()->id,
            'target_user_id' => $userPackage->user_id,
            'action' => 'user_package_updated',
            'model_type' => UserPackage::class,
            'model_id' => $userPackage->id,
            'payload' => $validated,
        ]);

        return back()->with('status', 'User package updated.');
    }

    public function pauseEarnings(Request $request, User $member): RedirectResponse
    {
        $active = $member->activeUserPackage;
        if (! $active) {
            return back()->withErrors(['message' => 'No active package to pause.']);
        }
        $active->update(['status' => UserPackage::STATUS_PAUSED]);
        AuditLog::create([
            'admin_id' => $request->user()->id,
            'target_user_id' => $member->id,
            'action' => 'earnings_paused',
            'model_type' => UserPackage::class,
            'model_id' => $active->id,
            'payload' => [],
        ]);

        return back()->with('status', 'Earnings paused for this user.');
    }

    public function resumeEarnings(Request $request, User $member): RedirectResponse
    {
        $paused = $member->userPackages()->where('status', UserPackage::STATUS_PAUSED)->first();
        if (! $paused) {
            return back()->withErrors(['message' => 'No paused package to resume.']);
        }
        $paused->update(['status' => UserPackage::STATUS_ACTIVE]);
        AuditLog::create([
            'admin_id' => $request->user()->id,
            'target_user_id' => $member->id,
            'action' => 'earnings_resumed',
            'model_type' => UserPackage::class,
            'model_id' => $paused->id,
            'payload' => [],
        ]);

        return back()->with('status', 'Earnings resumed.');
    }
}
