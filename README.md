# Aurum Node

Laravel + Inertia/React MLM web application.

## Features

- Paid packages (Starter, Builder, Accelerator, Elite, Titan, Legacy) and Access Package (admin)
- 4X cap on earnings, earnings ledger, direct/binary/ROI payouts
- Investment lock (investment_wallet), admin panel (Packages, User Package Controls, Volume Tool, Earnings Ledger, Payout Runs, Audit Logs)

## Setup

1. Clone the repo, then: `composer install`, `npm install`
2. Copy `.env.example` to `.env`, configure DB and app key
3. `php artisan key:generate`
4. `php artisan migrate`
5. `php artisan db:seed`
6. `npm run build` (or `npm run dev` for development)
7. Point web server to `public/`

## License

MIT
