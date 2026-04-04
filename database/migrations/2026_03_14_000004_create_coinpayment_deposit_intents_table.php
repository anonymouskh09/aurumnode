<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coinpayment_deposit_intents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_ref', 80)->unique();
            $table->string('provider_txn_id', 120)->nullable()->unique();
            $table->decimal('amount_requested', 18, 8);
            $table->decimal('amount_received', 18, 8)->default(0);
            $table->string('currency_requested', 40)->default('USDT');
            $table->string('currency_received', 40)->nullable();
            $table->string('pay_currency', 40)->default('USDT.TRC20');
            $table->string('status', 40)->default('pending');
            $table->text('status_message')->nullable();
            $table->json('provider_payload')->nullable();
            $table->timestamp('credited_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'credited_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coinpayment_deposit_intents');
    }
};

