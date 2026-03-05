<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    public function __construct(
        private WalletService $walletService
    ) {}

    public function index(Request $request): Response
    {
        $wallet = $this->walletService->getOrCreateWallet($request->user());

        return Inertia::render('Dashboard/Transfers', [
            'wallet' => $wallet,
        ]);
    }

    public function toWithdrawal(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'from' => ['required', 'in:deposit_wallet,direct_bonus_wallet,binary_bonus_wallet,roi_wallet,rank_award_wallet'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        try {
            $this->walletService->transferInternal(
                $request->user(),
                $validated['from'],
                'withdrawal_wallet',
                (float) $validated['amount']
            );
        } catch (\RuntimeException $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }

        return back()->with('status', 'Transferred to withdrawal wallet.');
    }

    public function toUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'to_username' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        try {
            $this->walletService->transferToUser(
                $request->user(),
                $validated['to_username'],
                'withdrawal_wallet',
                'deposit_wallet',
                (float) $validated['amount']
            );
        } catch (\RuntimeException $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }

        return back()->with('status', 'Transfer sent.');
    }
}
