<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->decimal('binary_percent', 5, 2)->nullable()->after('roi_weekly_percent');
            $table->decimal('monthly_roi_rate', 5, 2)->nullable()->after('binary_percent');
            $table->boolean('is_admin_only')->default(false)->after('is_leader');
        });

        Schema::table('user_packages', function (Blueprint $table) {
            $table->timestamp('expired_at')->nullable()->after('activated_at');
            $table->decimal('cap_multiplier', 5, 2)->default(4)->after('max_cap');
            $table->string('leader_activation_mode', 30)->nullable()->after('cap_multiplier'); // ADMIN_GRANTED, SELF_PURCHASE
            $table->boolean('renewal_required')->default(false)->after('leader_activation_mode');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['binary_percent', 'monthly_roi_rate', 'is_admin_only']);
        });
        Schema::table('user_packages', function (Blueprint $table) {
            $table->dropColumn(['expired_at', 'cap_multiplier', 'leader_activation_mode', 'renewal_required']);
        });
    }
};
