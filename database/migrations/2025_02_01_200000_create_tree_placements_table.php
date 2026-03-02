<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tree_placements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('new_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('chosen_side', 10); // 'left' | 'right'
            $table->foreignId('actual_parent_id')->constrained('users')->cascadeOnDelete();
            $table->string('attached_as', 20); // 'left_child' | 'right_child'
            $table->unsignedInteger('depth_from_sponsor')->default(0);
            $table->timestamps();

            $table->unique('new_user_id');
            $table->index(['sponsor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tree_placements');
    }
};
