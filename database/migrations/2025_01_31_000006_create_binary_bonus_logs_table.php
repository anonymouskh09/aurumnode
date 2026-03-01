<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('binary_bonus_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->decimal('left_points', 18, 2)->default(0);
            $table->decimal('right_points', 18, 2)->default(0);
            $table->decimal('lesser_points', 18, 2)->default(0);
            $table->decimal('percent_used', 5, 2)->default(0);
            $table->decimal('payout_amount', 18, 2)->default(0);
            $table->decimal('carried_left', 18, 2)->default(0);
            $table->decimal('carried_right', 18, 2)->default(0);
            $table->string('status', 20)->default('paid');
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('binary_bonus_logs');
    }
};
