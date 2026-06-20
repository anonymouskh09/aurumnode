<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Mail\WithdrawalRequestedMail;
use App\Models\Setting;
use App\Models\Transaction;
use App\Services\WalletService;
use App\Services\WithdrawalFeeService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Withdrawals: min amount, allowed days, tiered fee from settings.
 */
class WithdrawalController extends Controller
{
    private const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    public function __construct(
        private WalletService $walletService,
        private WithdrawalFeeService $withdrawalFeeService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        $withdrawals = $user->withdrawals()->latest()->get();

        $minUsd = (float) Setting::get('withdrawal_min_usd', 20);
        $allowedDays = $this->normalizeAllowedDays(Setting::get('withdrawal_allowed_days', [0, 1, 2, 3, 4, 5, 6]));
        $feeSettings = $this->withdrawalFeeService->getSettings();
        $todayDubai = $this->todayDubaiDayIndex();
        $allowedToday = in_array($todayDubai, $allowedDays, true);
        $allowedDayLabels = $this->formatAllowedDayLabels($allowedDays);

        $kycRequiredForWithdrawal = (bool) Setting::get('kyc_required_for_withdrawal', false);
        $hasKycApproved = $user->kycDocuments()->where('status', 'approved')->exists();

        return Inertia::render('Dashboard/Withdrawal', [
            'wallet' => $wallet,
            'withdrawals' => $withdrawals,
            'withdrawal_min_usd' => $minUsd,
            'withdrawal_allowed_days' => $allowedDays,
            'withdrawal_allowed_day_labels' => $allowedDayLabels,
            'withdrawal_fee_settings' => $feeSettings,
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
        $allowedDays = $this->normalizeAllowedDays(Setting::get('withdrawal_allowed_days', [0, 1, 2, 3, 4, 5, 6]));
        $todayDubai = $this->todayDubaiDayIndex();

        if (! in_array($todayDubai, $allowedDays, true)) {
            return back()->withErrors([
                'amount' => 'Withdrawals are not allowed today (Dubai time). Available days: '.$this->formatAllowedDayLabels($allowedDays).'.',
            ]);
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
        $fee = $this->withdrawalFeeService->calculateForAmount($amount);
        $feeAmount = $fee['fee_amount'];
        $feePercent = $fee['percent'];
        $totalDeduct = $fee['total_deduct'];

        if ((float) $wallet->withdrawal_wallet < $totalDeduct) {
            return back()->withErrors(['amount' => 'Insufficient balance (amount + '.$feePercent.'% fee = $'.number_format($totalDeduct, 2).').']);
        }

        $withdrawal = DB::transaction(function () use ($user, $amount, $feeAmount, $feePercent, $usdtAddress) {
            $this->walletService->deductForWithdrawal($user, $amount + $feeAmount);

            $withdrawal = $user->withdrawals()->create([
                'amount' => $amount,
                'fee_amount' => $feeAmount,
                'withdrawal_type' => 'company',
                'usdt_address' => $usdtAddress,
                'status' => 'pending',
            ]);

            $user->transactions()->create([
                'type' => Transaction::TYPE_WITHDRAWAL_REQUEST,
                'amount' => -($amount + $feeAmount),
                'meta_json' => ['status' => 'pending', 'fee' => $feeAmount, 'fee_percent' => $feePercent],
            ]);

            return $withdrawal;
        });

        Mail::to($user->email)->send(new WithdrawalRequestedMail($user, $withdrawal));

        return back()->with('status', 'Withdrawal request submitted. $'.number_format($feeAmount, 2).' fee ('.$feePercent.'%) applied.');
    }

    /** @return list<int> 0=Sun … 6=Sat (matches admin settings checkboxes) */
    private function normalizeAllowedDays(mixed $allowedDays): array
    {
        if (! is_array($allowedDays)) {
            return [0, 1, 2, 3, 4, 5, 6];
        }

        return array_values(array_unique(array_map('intval', $allowedDays)));
    }

    private function todayDubaiDayIndex(): int
    {
        return (int) Carbon::now('Asia/Dubai')->dayOfWeek;
    }

    /** @param  list<int>  $allowedDays */
    private function formatAllowedDayLabels(array $allowedDays): string
    {
        sort($allowedDays);

        if ($allowedDays === [0, 1, 2, 3, 4, 5, 6]) {
            return 'Every day';
        }

        $labels = array_filter(array_map(
            fn (int $d) => self::DAY_NAMES[$d] ?? null,
            $allowedDays
        ));

        return $labels !== [] ? implode(', ', $labels) : 'None configured';
    }
}
