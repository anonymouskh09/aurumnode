<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ranks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('level');
            $table->decimal('lesser_side_required', 18, 2);
            $table->decimal('binary_percent', 5, 2)->default(10); // 10% onward for Team Leader+
            $table->timestamps();
        });

        Schema::create('user_ranks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('rank_id')->constrained()->cascadeOnDelete();
            $table->timestamp('achieved_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'rank_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_ranks');
        Schema::dropIfExists('ranks');
    }
};
