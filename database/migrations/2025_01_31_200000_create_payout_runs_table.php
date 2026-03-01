<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payout_runs', function (Blueprint $table) {
            $table->id();
            $table->string('run_type', 50); // binary_daily, roi_weekly
            $table->string('period_key', 50); // e.g. 2025-01-31 or 2025-W05
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->string('status', 20)->default('pending'); // pending, running, completed, failed
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['run_type', 'period_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payout_runs');
    }
};
