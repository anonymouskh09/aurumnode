<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_package_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('maxout_count')->default(0);
            $table->timestamp('last_maxed_out_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'package_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_package_progress');
    }
};
