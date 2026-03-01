<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(): Response
    {
        $withdrawals = Withdrawal::with('user')->where('status', 'pending')->latest()->paginate(20);

        return Inertia::render('Admin/Withdrawals', ['withdrawals' => $withdrawals]);
    }

    public function approve(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($withdrawal->user);
        $wallet->increment('total_withdrawn', $withdrawal->amount);
        $withdrawal->update(['status' => 'approved']);

        AuditLog::create(['admin_id' => $request->user()->id, 'action' => 'withdrawal_approved', 'model_type' => Withdrawal::class, 'model_id' => $withdrawal->id]);

        return back()->with('status', 'Withdrawal approved.');
    }

    public function reject(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        $this->walletService->getOrCreateWallet($withdrawal->user);
        $withdrawal->user->wallet->increment('withdrawal_wallet', $withdrawal->amount);
        $withdrawal->update(['status' => 'rejected']);

        AuditLog::create(['admin_id' => $request->user()->id, 'action' => 'withdrawal_rejected', 'model_type' => Withdrawal::class, 'model_id' => $withdrawal->id]);

        return back()->with('status', 'Withdrawal rejected.');
    }
}
