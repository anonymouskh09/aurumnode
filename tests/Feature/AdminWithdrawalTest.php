<?php

namespace Tests\Feature;

use App\Mail\WithdrawalApprovedMail;
use App\Mail\WithdrawalRejectedMail;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Withdrawal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminWithdrawalTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_approve_pending_withdrawal(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create(['is_admin' => false]);
        Wallet::create([
            'user_id' => $member->id,
            'withdrawal_wallet' => 0,
            'total_withdrawn' => 0,
        ]);

        $withdrawal = Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 300,
            'fee_amount' => 9,
            'withdrawal_type' => 'company',
            'usdt_address' => '0xabc123',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.withdrawals.approve', $withdrawal));

        $response->assertRedirect();
        $response->assertSessionHas('status');

        $withdrawal->refresh();
        $member->wallet->refresh();

        $this->assertSame('approved', $withdrawal->status);
        $this->assertEqualsWithDelta(300.0, (float) $member->wallet->total_withdrawn, 0.01);

        Mail::assertSent(WithdrawalApprovedMail::class, fn ($mail) => $mail->hasTo($member->email));
    }

    public function test_admin_can_reject_pending_withdrawal_and_refund_full_amount(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create(['is_admin' => false]);
        Wallet::create([
            'user_id' => $member->id,
            'withdrawal_wallet' => 100,
            'total_withdrawn' => 0,
        ]);

        $withdrawal = Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 300,
            'fee_amount' => 9,
            'withdrawal_type' => 'company',
            'usdt_address' => '222333',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.withdrawals.reject', $withdrawal));

        $response->assertRedirect();
        $response->assertSessionHas('status');

        $withdrawal->refresh();
        $member->wallet->refresh();

        $this->assertSame('rejected', $withdrawal->status);
        $this->assertEqualsWithDelta(409.0, (float) $member->wallet->withdrawal_wallet, 0.01);

        Mail::assertSent(WithdrawalRejectedMail::class, fn ($mail) => $mail->hasTo($member->email));
    }

    public function test_admin_withdrawals_index_shows_all_statuses(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create(['is_admin' => false]);

        Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 50,
            'fee_amount' => 5,
            'withdrawal_type' => 'company',
            'usdt_address' => '0x1',
            'status' => 'pending',
        ]);
        Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 100,
            'fee_amount' => 10,
            'withdrawal_type' => 'company',
            'usdt_address' => '0x2',
            'status' => 'approved',
        ]);
        Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 200,
            'fee_amount' => 20,
            'withdrawal_type' => 'company',
            'usdt_address' => '0x3',
            'status' => 'rejected',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.withdrawals'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Withdrawals')
            ->has('withdrawals.data', 3)
        );
    }

    public function test_cannot_approve_already_processed_withdrawal(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create(['is_admin' => false]);

        $withdrawal = Withdrawal::create([
            'user_id' => $member->id,
            'amount' => 100,
            'fee_amount' => 10,
            'withdrawal_type' => 'company',
            'usdt_address' => '0xabc',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.withdrawals.approve', $withdrawal));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        Mail::assertNothingSent();
    }
}
