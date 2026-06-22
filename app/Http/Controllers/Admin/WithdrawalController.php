<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WithdrawalApprovedMail;
use App\Mail\WithdrawalRejectedMail;
use App\Models\AuditLog;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(): Response
    {
        $withdrawals = Withdrawal::with('user')->latest()->paginate(20);

        return Inertia::render('Admin/Withdrawals', ['withdrawals' => $withdrawals]);
    }

    public function approve(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'This withdrawal has already been processed.');
        }

        $withdrawal->load('user');

        DB::transaction(function () use ($withdrawal) {
            $wallet = $this->walletService->getOrCreateWallet($withdrawal->user);
            $wallet->increment('total_withdrawn', $withdrawal->amount);
            $withdrawal->update(['status' => 'approved']);
        });

        try {
            Mail::to($withdrawal->user->email)->send(new WithdrawalApprovedMail($withdrawal->user, $withdrawal->fresh()));
        } catch (\Throwable $e) {
            Log::warning('Withdrawal approved but approval email failed', [
                'withdrawal_id' => $withdrawal->id,
                'error' => $e->getMessage(),
            ]);
        }

        AuditLog::create([
            'admin_id' => $request->user()->id,
            'target_user_id' => $withdrawal->user_id,
            'action' => 'withdrawal_approved',
            'model_type' => Withdrawal::class,
            'model_id' => $withdrawal->id,
        ]);

        return back()->with('status', 'Withdrawal approved successfully.');
    }

    public function reject(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'This withdrawal has already been processed.');
        }

        $withdrawal->load('user');
        $refundAmount = (float) $withdrawal->amount + (float) ($withdrawal->fee_amount ?? 0);

        DB::transaction(function () use ($withdrawal, $refundAmount) {
            $wallet = $this->walletService->getOrCreateWallet($withdrawal->user);
            $wallet->increment('withdrawal_wallet', $refundAmount);
            $withdrawal->update(['status' => 'rejected']);

            $withdrawal->user->transactions()->create([
                'type' => Transaction::TYPE_WITHDRAWAL_REQUEST,
                'amount' => $refundAmount,
                'meta_json' => [
                    'status' => 'rejected',
                    'withdrawal_id' => $withdrawal->id,
                    'refund' => true,
                ],
            ]);
        });

        try {
            Mail::to($withdrawal->user->email)->send(
                new WithdrawalRejectedMail($withdrawal->user, $withdrawal->fresh(), $refundAmount)
            );
        } catch (\Throwable $e) {
            Log::warning('Withdrawal rejected but rejection email failed', [
                'withdrawal_id' => $withdrawal->id,
                'error' => $e->getMessage(),
            ]);
        }

        AuditLog::create([
            'admin_id' => $request->user()->id,
            'target_user_id' => $withdrawal->user_id,
            'action' => 'withdrawal_rejected',
            'model_type' => Withdrawal::class,
            'model_id' => $withdrawal->id,
        ]);

        return back()->with('status', 'Withdrawal rejected. User wallet refunded and notified by email.');
    }
}
