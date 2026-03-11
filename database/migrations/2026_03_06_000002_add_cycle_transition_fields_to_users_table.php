<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cycle_status', 20)->default('ACTIVE')->after('right_carry_total');
            $table->decimal('highest_package_price_in_cycle', 18, 2)->default(0)->after('cycle_status');
            $table->decimal('maxout_highest_package_price', 18, 2)->nullable()->after('highest_package_price_in_cycle');
            $table->decimal('total_investment_in_cycle', 18, 2)->default(0)->after('maxout_highest_package_price');
            $table->decimal('total_cap_in_cycle', 18, 2)->default(0)->after('total_investment_in_cycle');
            $table->decimal('total_earned_in_cycle', 18, 2)->default(0)->after('total_cap_in_cycle');
            $table->decimal('renewal_min_price', 18, 2)->nullable()->after('total_earned_in_cycle');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'cycle_status',
                'highest_package_price_in_cycle',
                'maxout_highest_package_price',
                'total_investment_in_cycle',
                'total_cap_in_cycle',
                'total_earned_in_cycle',
                'renewal_min_price',
            ]);
        });
    }
};
