<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('earnings_ledger', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_package_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30); // DIRECT, BINARY, ROI
            $table->decimal('amount', 18, 2);
            $table->string('ref_id', 100)->nullable();
            $table->foreignId('payout_run_id')->nullable()->constrained('payout_runs')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'type', 'created_at']);
            $table->index(['user_package_id', 'created_at']);
            $table->unique(['user_package_id', 'type', 'ref_id'], 'earnings_ledger_package_type_ref_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('earnings_ledger');
    }
};
