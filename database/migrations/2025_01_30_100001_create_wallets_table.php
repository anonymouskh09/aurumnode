<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('deposit_wallet', 18, 2)->default(0);
            $table->decimal('withdrawal_wallet', 18, 2)->default(0);
            $table->decimal('direct_bonus_wallet', 18, 2)->default(0);
            $table->decimal('binary_bonus_wallet', 18, 2)->default(0);
            $table->decimal('roi_wallet', 18, 2)->default(0);
            $table->decimal('rank_award_wallet', 18, 2)->default(0);
            $table->decimal('total_withdrawn', 18, 2)->default(0);
            $table->decimal('total_roi', 18, 2)->default(0);
            $table->decimal('total_bonus', 18, 2)->default(0);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
