<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

/**
 * Wallet operations - all balance updates go through this service.
 * Ensures consistency, prevents negative balances.
 */
class WalletService
{
    /**
     * Get or create wallet for user (1 row per user).
     */
    public function getOrCreateWallet(User $user): Wallet
    {
        return Wallet::firstOrCreate(
            ['user_id' => $user->id],
            [
                'deposit_wallet' => 0,
                'investment_wallet' => 0,
                'withdrawal_wallet' => 0,
                'direct_bonus_wallet' => 0,
                'binary_bonus_wallet' => 0,
                'roi_wallet' => 0,
                'rank_award_wallet' => 0,
                'total_withdrawn' => 0,
                'total_roi' => 0,
                'total_bonus' => 0,
            ]
        );
    }

    /** Only investment is locked; deposit_wallet can be used to transfer to other users or buy packages. */
    public const LOCKED_SOURCES = ['investment_wallet'];

    /**
     * Transfer from one wallet column to another for same user.
     * Investment and deposit are LOCKED: cannot transfer from them (backend enforcement).
     */
    public function transferInternal(User $user, string $fromColumn, string $toColumn, float $amount): void
    {
        $allowed = ['deposit_wallet', 'investment_wallet', 'withdrawal_wallet', 'direct_bonus_wallet', 'binary_bonus_wallet', 'roi_wallet', 'rank_award_wallet'];
        if (! in_array($fromColumn, $allowed) || ! in_array($toColumn, $allowed) || $fromColumn === $toColumn) {
            throw new \InvalidArgumentException('Invalid wallet columns');
        }
        if (in_array($fromColumn, self::LOCKED_SOURCES, true)) {
            throw new \RuntimeException('Investment locked. Withdrawal not available.');
        }

        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        DB::transaction(function () use ($user, $fromColumn, $toColumn, $amount) {
            $wallet = $this->getOrCreateWallet($user);
            $fromBalance = (float) $wallet->{$fromColumn};

            if ($fromBalance < $amount) {
                throw new \RuntimeException('Insufficient balance in source wallet');
            }

            $wallet->{$fromColumn} = $fromBalance - $amount;
            $wallet->{$toColumn} = (float) $wallet->{$toColumn} + $amount;
            $wallet->save();

            $user->transactions()->create([
                'type' => Transaction::TYPE_TRANSFER,
                'amount' => -$amount,
                'meta_json' => ['from' => $fromColumn, 'to' => $toColumn],
            ]);
        });
    }

    /**
     * Transfer from one user's wallet to another user's wallet (by username).
     */
    public function transferToUser(User $fromUser, string $toUsername, string $fromColumn, string $toColumn, float $amount): void
    {
        $recipient = User::where('username', $toUsername)->first();
        if (! $recipient) {
            throw new \RuntimeException('Recipient user not found');
        }
        if ($recipient->id === $fromUser->id) {
            throw new \RuntimeException('Cannot transfer to yourself');
        }

        $allowed = ['deposit_wallet', 'investment_wallet', 'withdrawal_wallet', 'direct_bonus_wallet', 'binary_bonus_wallet', 'roi_wallet', 'rank_award_wallet'];
        if (! in_array($fromColumn, $allowed) || ! in_array($toColumn, $allowed)) {
            throw new \InvalidArgumentException('Invalid wallet columns');
        }
        if (in_array($fromColumn, self::LOCKED_SOURCES, true)) {
            throw new \RuntimeException('Investment locked. Withdrawal not available.');
        }

        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        DB::transaction(function () use ($fromUser, $recipient, $fromColumn, $toColumn, $amount) {
            $fromWallet = $this->getOrCreateWallet($fromUser);
            $fromBalance = (float) $fromWallet->{$fromColumn};

            if ($fromBalance < $amount) {
                throw new \RuntimeException('Insufficient balance');
            }

            $fromWallet->{$fromColumn} = $fromBalance - $amount;
            $fromWallet->save();

            $toWallet = $this->getOrCreateWallet($recipient);
            $toWallet->{$toColumn} = (float) $toWallet->{$toColumn} + $amount;
            $toWallet->save();

            $fromUser->transactions()->create([
                'type' => Transaction::TYPE_TRANSFER,
                'amount' => -$amount,
                'meta_json' => ['to_user_id' => $recipient->id, 'to_username' => $recipient->username, 'from' => $fromColumn, 'to' => $toColumn],
            ]);

            $recipient->transactions()->create([
                'type' => Transaction::TYPE_TRANSFER,
                'amount' => $amount,
                'meta_json' => ['from_user_id' => $fromUser->id, 'from_username' => $fromUser->username, 'from' => $fromColumn, 'to' => $toColumn],
            ]);
        });
    }

    /**
     * Deduct from withdrawal_wallet for withdrawal request.
     */
    public function deductForWithdrawal(User $user, float $amount): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        DB::transaction(function () use ($user, $amount) {
            $wallet = $this->getOrCreateWallet($user);
            $balance = (float) $wallet->withdrawal_wallet;

            if ($balance < $amount) {
                throw new \RuntimeException('Insufficient withdrawal balance');
            }

            $wallet->withdrawal_wallet = $balance - $amount;
            $wallet->save();
        });
    }

    /**
     * Add to deposit_wallet (e.g. top-up; not for package purchase).
     */
    public function addToDeposit(User $user, float $amount): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        DB::transaction(function () use ($user, $amount) {
            $wallet = $this->getOrCreateWallet($user);
            $wallet->deposit_wallet = (float) $wallet->deposit_wallet + $amount;
            $wallet->save();

            $user->transactions()->create([
                'type' => Transaction::TYPE_DEPOSIT,
                'amount' => $amount,
                'meta_json' => ['to' => 'deposit_wallet'],
            ]);
        });
    }

    /**
     * Add to investment_wallet (LOCKED - package purchase only). Never withdrawable.
     */
    public function addToInvestment(User $user, float $amount): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        $wallet = $this->getOrCreateWallet($user);
        $wallet->investment_wallet = (float) ($wallet->investment_wallet ?? 0) + $amount;
        $wallet->save();
    }

    /**
     * Deduct from deposit_wallet (e.g. for package purchase). Caller must ensure balance >= amount.
     */
    public function deductFromDeposit(User $user, float $amount): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        $wallet = $this->getOrCreateWallet($user);
        $balance = (float) $wallet->deposit_wallet;
        if ($balance < $amount) {
            throw new \RuntimeException('Insufficient deposit balance. You need $'.number_format($amount, 2).' USDT in your Deposit Wallet. Transferred funds from other users go to your Deposit Wallet and can be used to buy packages.');
        }

        $wallet->deposit_wallet = $balance - $amount;
        $wallet->save();
    }

    /**
     * Deduct from withdrawal_wallet (e.g. for package purchase). Caller must ensure balance >= amount.
     */
    public function deductFromWithdrawal(User $user, float $amount): void
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        $wallet = $this->getOrCreateWallet($user);
        $balance = (float) $wallet->withdrawal_wallet;
        if ($balance < $amount) {
            throw new \RuntimeException('Insufficient withdrawal balance. You need $'.number_format($amount, 2).' USDT in your Withdrawal Wallet.');
        }

        $wallet->withdrawal_wallet = $balance - $amount;
        $wallet->save();
    }
}
