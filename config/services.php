<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'coinpayments' => [
        'enabled' => env('COINPAYMENTS_ENABLED', false),
        'merchant_id' => env('COINPAYMENTS_MERCHANT_ID'),
        'public_key' => env('COINPAYMENTS_PUBLIC_KEY'),
        'private_key' => env('COINPAYMENTS_PRIVATE_KEY'),
        'ipn_secret' => env('COINPAYMENTS_IPN_SECRET'),
        'ipn_url' => env('COINPAYMENTS_IPN_URL'),
        'api_url' => env('COINPAYMENTS_API_URL', 'https://www.coinpayments.net/api.php'),
        'currency_base' => env('COINPAYMENTS_CURRENCY_BASE', 'USDT'),
        'default_pay_currency' => env('COINPAYMENTS_DEFAULT_PAY_CURRENCY', 'USDT.TRC20'),
        'allowed_pay_currencies' => array_filter(array_map('trim', explode(',', (string) env('COINPAYMENTS_ALLOWED_PAY_CURRENCIES', 'USDT.TRC20,USDT.BEP20,USDT.ERC20,USDT.SOL')))),
        'min_deposit' => (float) env('COINPAYMENTS_MIN_DEPOSIT', 10),
    ],

];
