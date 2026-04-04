<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\CoinpaymentDepositIntent;
use App\Services\CoinpaymentsService;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CoinpaymentsController extends Controller
{
    public function __construct(
        private CoinpaymentsService $coinpaymentsService,
        private WalletService $walletService
    ) {}

    public function startDeposit(Request $request): Response|RedirectResponse
    {
        if (! $this->coinpaymentsService->isEnabled()) {
            return back()->withErrors(['amount' => 'CoinPayments is currently disabled.']);
        }

        $minDeposit = $this->coinpaymentsService->minDepositAmount();
        $allowedPayCurrencies = config('services.coinpayments.allowed_pay_currencies', []);
        if (! is_array($allowedPayCurrencies) || $allowedPayCurrencies === []) {
            $allowedPayCurrencies = ['USDT.TRC20', 'USDT.BEP20', 'USDT.ERC20', 'USDT.SOL'];
        }
        $defaultPayCurrency = (string) config('services.coinpayments.default_pay_currency', 'USDT.TRC20');
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:'.$minDeposit, 'max:1000000'],
            'pay_currency' => ['nullable', 'string', 'max:40', 'in:'.implode(',', $allowedPayCurrencies)],
        ]);

        $amount = round((float) $validated['amount'], 8);
        $payCurrency = (string) ($validated['pay_currency'] ?? $defaultPayCurrency);
        $intent = CoinpaymentDepositIntent::create([
            'user_id' => $request->user()->id,
            'order_ref' => $this->coinpaymentsService->createOrderRef(),
            'amount_requested' => $amount,
            'currency_requested' => 'USDT',
            'pay_currency' => $payCurrency,
            'status' => CoinpaymentDepositIntent::STATUS_PENDING,
            'status_message' => 'Intent created',
        ]);

        try {
            $result = $this->coinpaymentsService->createTransaction($intent->load('user'));
            $intent->update([
                'provider_txn_id' => $result['provider_txn_id'],
                'status' => CoinpaymentDepositIntent::STATUS_AWAITING_PAYMENT,
                'status_message' => 'Awaiting blockchain confirmation',
                'provider_payload' => $result['raw'],
            ]);

            return Inertia::location($result['checkout_url']);
        } catch (\Throwable $e) {
            $intent->update([
                'status' => CoinpaymentDepositIntent::STATUS_FAILED,
                'status_message' => $e->getMessage(),
            ]);

            return back()->withErrors(['amount' => 'Unable to initialize CoinPayments checkout. '.$e->getMessage()]);
        }
    }

    public function ipn(Request $request): Response
    {
        if (! $this->coinpaymentsService->verifyIpnSignature($request)) {
            return response('Invalid IPN signature', 403);
        }

        if (! $this->coinpaymentsService->merchantMatches($request)) {
            return response('Invalid merchant', 403);
        }

        $orderRef = (string) ($request->input('custom')
            ?: $request->input('item_number')
            ?: $request->input('invoice')
            ?: '');
        if ($orderRef === '') {
            return response('Missing order reference', 422);
        }

        $statusCode = (int) $request->input('status', 0);
        $statusText = (string) $request->input('status_text', '');
        $providerTxnId = (string) $request->input('txn_id', '');
        $amountReceived = round((float) $request->input('amount1', 0), 8);
        $currencyReceived = (string) $request->input('currency1', 'USDT');

        DB::transaction(function () use ($orderRef, $providerTxnId, $statusCode, $statusText, $amountReceived, $currencyReceived, $request) {
            $intent = CoinpaymentDepositIntent::query()
                ->where('order_ref', $orderRef)
                ->lockForUpdate()
                ->first();

            if (! $intent) {
                throw new \RuntimeException('Deposit intent not found for order '.$orderRef);
            }

            if ($providerTxnId !== '' && ! $intent->provider_txn_id) {
                $intent->provider_txn_id = $providerTxnId;
            }

            $intent->amount_received = $amountReceived;
            $intent->currency_received = $currencyReceived ?: 'USDT';
            $intent->status_message = $statusText;
            $intent->provider_payload = $request->all();

            if ($statusCode < 0) {
                $intent->status = CoinpaymentDepositIntent::STATUS_FAILED;
                $intent->save();
                return;
            }

            if ($statusCode < 100) {
                $intent->status = CoinpaymentDepositIntent::STATUS_AWAITING_PAYMENT;
                $intent->save();
                return;
            }

            if ($intent->credited_at) {
                $intent->status = CoinpaymentDepositIntent::STATUS_COMPLETED;
                $intent->save();
                return;
            }

            if ($amountReceived + 0.00000001 < (float) $intent->amount_requested) {
                $intent->status = CoinpaymentDepositIntent::STATUS_PARTIAL;
                $intent->status_message = 'Underpaid amount. Awaiting manual review.';
                $intent->save();
                return;
            }

            $creditAmount = (float) $intent->amount_requested;
            $this->walletService->addToDeposit($intent->user, $creditAmount);

            $intent->status = CoinpaymentDepositIntent::STATUS_COMPLETED;
            $intent->credited_at = now();
            $intent->save();
        });

        return response('IPN OK', 200);
    }
}

