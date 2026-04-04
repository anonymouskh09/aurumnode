<?php

namespace App\Services;

use App\Models\CoinpaymentDepositIntent;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CoinpaymentsService
{
    public function __construct(
        private HttpFactory $http
    ) {}

    public function isEnabled(): bool
    {
        return (bool) config('services.coinpayments.enabled', false);
    }

    public function minDepositAmount(): float
    {
        return (float) config('services.coinpayments.min_deposit', 10);
    }

    public function createOrderRef(): string
    {
        return 'CPD-'.now()->format('YmdHis').'-'.Str::upper(Str::random(8));
    }

    /**
     * Create checkout transaction on CoinPayments API.
     *
     * @return array{checkout_url:string,provider_txn_id:string|null,raw:array<string,mixed>}
     */
    public function createTransaction(CoinpaymentDepositIntent $intent): array
    {
        $apiUrl = (string) config('services.coinpayments.api_url', 'https://www.coinpayments.net/api.php');
        $publicKey = (string) config('services.coinpayments.public_key');
        $privateKey = (string) config('services.coinpayments.private_key');
        $ipnUrl = (string) config('services.coinpayments.ipn_url');
        $currency1 = (string) config('services.coinpayments.currency_base', 'USDT');
        $currency2 = (string) ($intent->pay_currency ?: config('services.coinpayments.default_pay_currency', 'USDT.TRC20'));

        if ($publicKey === '' || $privateKey === '' || $ipnUrl === '') {
            throw new \RuntimeException('CoinPayments credentials are incomplete.');
        }

        $payload = [
            'version' => 1,
            'cmd' => 'create_transaction',
            'key' => $publicKey,
            'format' => 'json',
            'amount' => number_format((float) $intent->amount_requested, 8, '.', ''),
            'currency1' => $currency1,
            'currency2' => $currency2,
            'buyer_email' => (string) $intent->user->email,
            'ipn_url' => $ipnUrl,
            'item_name' => 'AurumNode Deposit Wallet Top-up',
            'item_number' => $intent->order_ref,
            'custom' => $intent->order_ref,
        ];

        $body = http_build_query($payload, '', '&');
        $hmac = hash_hmac('sha512', $body, $privateKey);

        $response = $this->http
            ->withHeaders(['HMAC' => $hmac])
            ->asForm()
            ->post($apiUrl, $payload);

        if (! $response->ok()) {
            throw new \RuntimeException('CoinPayments API request failed with status '.$response->status().'.');
        }

        /** @var array<string,mixed> $data */
        $data = $response->json();
        $error = (string) Arr::get($data, 'error', '');
        if ($error !== '' && strtoupper($error) !== 'OK') {
            throw new \RuntimeException('CoinPayments error: '.$error);
        }

        $result = Arr::get($data, 'result', []);
        $checkoutUrl = (string) Arr::get($result, 'checkout_url', '');
        if ($checkoutUrl === '') {
            throw new \RuntimeException('CoinPayments did not return checkout_url.');
        }

        return [
            'checkout_url' => $checkoutUrl,
            'provider_txn_id' => Arr::get($result, 'txn_id') ? (string) Arr::get($result, 'txn_id') : null,
            'raw' => $data,
        ];
    }

    public function verifyIpnSignature(Request $request): bool
    {
        if (app()->environment('local') && (bool) env('COINPAYMENTS_SKIP_IPN_HMAC_IN_LOCAL', false)) {
            return true;
        }

        $secret = (string) config('services.coinpayments.ipn_secret');
        if ($secret === '') {
            return false;
        }

        $mode = (string) $request->input('ipn_mode', '');
        if (strtolower($mode) !== 'hmac') {
            return false;
        }

        $hmacHeader = (string) $request->header('HMAC', '');
        if ($hmacHeader === '') {
            return false;
        }

        $rawBody = (string) $request->getContent();
        $calculated = hash_hmac('sha512', $rawBody, $secret);

        return hash_equals(strtolower($calculated), strtolower($hmacHeader));
    }

    public function merchantMatches(Request $request): bool
    {
        $merchantExpected = (string) config('services.coinpayments.merchant_id');
        $merchantReceived = (string) $request->input('merchant', '');

        return $merchantExpected !== '' && hash_equals($merchantExpected, $merchantReceived);
    }
}

