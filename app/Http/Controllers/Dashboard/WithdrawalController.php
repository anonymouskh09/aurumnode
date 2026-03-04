<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Withdrawals: min amount and allowed days from settings.
 * 2% fee for company (external) withdrawals; 0% for internal transfer.
 */
class WithdrawalController extends Controller
{
    public function __construct(
        private WalletService $walletService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        $withdrawals = $user->withdrawals()->latest()->get();

        $minUsd = (float) Setting::get('withdrawal_min_usd', 20);
        $allowedDays = Setting::get('withdrawal_allowed_days', [0, 1, 2, 3, 4, 5, 6]);
        $feePercent = (float) Setting::get('withdrawal_fee_percent', 2);
        $todayDubai = (int) Carbon::now('Asia/Dubai')->format('N'); // 1=Mon, 7=Sun (ISO 8601)
        $allowedToday = is_array($allowedDays) && in_array($todayDubai, $allowedDays, true);

        $kycRequiredForWithdrawal = (bool) Setting::get('kyc_required_for_withdrawal', false);
        $hasKycApproved = $user->kycDocuments()->where('status', 'approved')->exists();

        return Inertia::render('Dashboard/Withdrawal', [
            'wallet' => $wallet,
            'withdrawals' => $withdrawals,
            'withdrawal_min_usd' => $minUsd,
            'withdrawal_allowed_days' => $allowedDays,
            'withdrawal_fee_percent' => $feePercent,
            'withdrawal_allowed_today' => $allowedToday,
            'kyc_required_for_withdrawal' => $kycRequiredForWithdrawal,
            'has_kyc_approved' => $hasKycApproved,
            'show_kyc_required_notice' => $kycRequiredForWithdrawal && ! $hasKycApproved,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        $minUsd = (float) Setting::get('withdrawal_min_usd', 20);
        $allowedDays = Setting::get('withdrawal_allowed_days', [0, 1, 2, 3, 4, 5, 6]);
        $feePercent = (float) Setting::get('withdrawal_fee_percent', 2);
        $todayDubai = (int) Carbon::now('Asia/Dubai')->format('N');

        if (! (is_array($allowedDays) && in_array($todayDubai, $allowedDays, true))) {
            return back()->withErrors(['amount' => 'Withdrawals are not allowed on this day (Dubai time). Check allowed days in settings.']);
        }

        $kycRequiredForWithdrawal = (bool) Setting::get('kyc_required_for_withdrawal', false);
        if ($kycRequiredForWithdrawal && ! $user->kycDocuments()->where('status', 'approved')->exists()) {
            return back()->withErrors(['amount' => 'KYC approval is required before you can withdraw. Please complete and get your KYC approved first.']);
        }

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:'.$minUsd, 'max:'.(float) $wallet->withdrawal_wallet],
            'transaction_password' => ['required'],
        ]);

        if (! $user->transaction_password) {
            return back()->withErrors(['transaction_password' => 'Please set your transaction password in Profile first.']);
        }

        if (! Hash::check($validated['transaction_password'], $user->transaction_password)) {
            return back()->withErrors(['transaction_password' => 'Invalid transaction password.']);
        }

        $usdtAddress = $user->usdt_address;
        if (empty($usdtAddress)) {
            return back()->withErrors(['amount' => 'Please set your USDT withdrawal address in Profile first.']);
        }

        $amount = (float) $validated['amount'];
        $feeAmount = round($amount * ($feePercent / 100), 2);
        $totalDeduct = $amount + $feeAmount;

        if ((float) $wallet->withdrawal_wallet < $totalDeduct) {
            return back()->withErrors(['amount' => 'Insufficient balance (amount + '.$feePercent.'% fee).']);
        }

        DB::transaction(function () use ($user, $amount, $feeAmount, $usdtAddress) {
            $this->walletService->deductForWithdrawal($user, $amount + $feeAmount);

            $user->withdrawals()->create([
                'amount' => $amount,
                'fee_amount' => $feeAmount,
                'withdrawal_type' => 'company',
                'usdt_address' => $usdtAddress,
                'status' => 'pending',
            ]);

            $user->transactions()->create([
                'type' => Transaction::TYPE_WITHDRAWAL_REQUEST,
                'amount' => -($amount + $feeAmount),
                'meta_json' => ['status' => 'pending', 'fee' => $feeAmount],
            ]);
        });

        return back()->with('status', 'Withdrawal request submitted. '.$feeAmount.' USD fee applied.');
    }
}
