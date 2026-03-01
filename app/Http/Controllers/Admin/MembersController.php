<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Package;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin member management: list (with filters), view, activate/block,
 * KYC, upgrade package, reset password, manual wallet adjustment, activity logs.
 */
class MembersController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(Request $request): Response
    {
        $query = User::query()->where('is_admin', false)->withCount('referrals')->with(['sponsor:id,username,name', 'wallet', 'userPackages.package']);

        if ($request->filled('status')) {
            if ($request->status === 'blocked') {
                $query->where('is_blocked', true);
            } else {
                $query->where('status', $request->status)->where('is_blocked', false);
            }
        }
        if ($request->filled('package_id')) {
            $query->whereHas('userPackages', fn ($q) => $q->where('package_id', $request->package_id));
        }
        if ($request->filled('rank_id')) {
            $query->whereHas('userRanks', fn ($q) => $q->where('ranks.id', $request->rank_id));
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('username', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")->orWhere('name', 'like', "%{$s}%"));
        }

        $members = $query->latest()->paginate(20)->withQueryString();
        $packages = Package::orderBy('price_usd')->get(['id', 'name']);
        $ranks = \App\Models\Rank::orderBy('level')->get(['id', 'name']);

        return Inertia::render('Admin/Members', [
            'members' => $members,
            'packages' => $packages,
            'ranks' => $ranks,
            'filters' => $request->only(['status', 'package_id', 'rank_id', 'search']),
        ]);
    }

    public function show(User $member): Response
    {
        $member->load([
            'sponsor:id,username,name,email',
            'wallet',
            'userPackages.package',
            'withdrawals',
            'kycDocuments',
            'userRanks',
        ]);
        $member->referrals_count = $member->referrals()->count();
        $packages = Package::orderBy('price_usd')->get(['id', 'name', 'price_usd']);
        $logs = AuditLog::where('model_type', User::class)->where('model_id', $member->id)->latest()->limit(50)->get();

        return Inertia::render('Admin/MemberShow', [
            'member' => $member,
            'packages' => $packages,
            'activityLogs' => $logs,
        ]);
    }

    public function update(Request $request, User $member): RedirectResponse
    {
        $this->authorizeAdminMember($member);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $member->id],
            'mobile' => ['nullable', 'string', 'max:30'],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string'],
            'usdt_address' => ['nullable', 'string', 'max:255'],
            'is_blocked' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:free,paid'],
        ]);

        $member->update($validated);

        if ($request->has('is_blocked')) {
            $this->audit($request, 'member_block_toggle', $member, ['is_blocked' => $member->is_blocked]);
        }

        return back()->with('status', 'Member updated.');
    }

    public function resetPassword(Request $request, User $member): RedirectResponse
    {
        $this->authorizeAdminMember($member);

        $validated = $request->validate(['password' => ['required', 'string', 'min:8', 'confirmed']]);

        $member->update(['password' => Hash::make($validated['password'])]);

        $this->audit($request, 'member_password_reset', $member);

        return back()->with('status', 'Password reset.');
    }

    public function walletAdjust(Request $request, User $member): RedirectResponse
    {
        $this->authorizeAdminMember($member);

        $validated = $request->validate([
            'wallet' => ['required', 'in:deposit_wallet,investment_wallet,withdrawal_wallet,direct_bonus_wallet,binary_bonus_wallet,roi_wallet,rank_award_wallet'],
            'amount' => ['required', 'numeric'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $wallet = $this->walletService->getOrCreateWallet($member);
        $amount = (float) $validated['amount'];

        if ($amount >= 0) {
            $wallet->increment($validated['wallet'], $amount);
        } else {
            $current = (float) $wallet->{$validated['wallet']};
            $wallet->decrement($validated['wallet'], min(abs($amount), $current));
        }

        $this->audit($request, 'member_wallet_adjust', $member, [
            'wallet' => $validated['wallet'],
            'amount' => $amount,
            'reason' => $validated['reason'] ?? null,
        ]);

        return back()->with('status', 'Wallet adjusted.');
    }

    private function authorizeAdminMember(User $member): void
    {
        if ($member->is_admin) {
            abort(403, 'Cannot modify admin user.');
        }
    }

    private function audit(Request $request, string $action, User $member, array $payload = []): void
    {
        AuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => $action,
            'model_type' => User::class,
            'model_id' => $member->id,
            'payload' => $payload,
        ]);
    }
}
