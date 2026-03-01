<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('active_package_id')->nullable()->after('is_admin')->constrained('user_packages')->nullOnDelete();
            $table->decimal('left_carry_total', 18, 2)->default(0)->after('right_points_total');
            $table->decimal('right_carry_total', 18, 2)->default(0)->after('left_carry_total');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['active_package_id']);
            $table->dropColumn(['active_package_id', 'left_carry_total', 'right_carry_total']);
        });
    }
};
