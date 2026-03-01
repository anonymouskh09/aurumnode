<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Withdrawal fee and type (company vs internal transfer). */
    public function up(): void
    {
        Schema::table('withdrawals', function (Blueprint $table) {
            $table->decimal('fee_amount', 18, 2)->default(0)->after('amount');
            $table->string('withdrawal_type', 20)->default('company')->after('fee_amount'); // company | internal
        });
    }

    public function down(): void
    {
        Schema::table('withdrawals', function (Blueprint $table) {
            $table->dropColumn(['fee_amount', 'withdrawal_type']);
        });
    }
};
