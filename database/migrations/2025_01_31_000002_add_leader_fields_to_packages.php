<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->boolean('is_leader')->default(false)->after('status');
            $table->decimal('power_leg_points', 18, 2)->default(0)->after('is_leader');
            $table->boolean('roi_enabled')->default(true)->after('power_leg_points');
            $table->boolean('pays_direct_bonus')->default(true)->after('roi_enabled');
            $table->boolean('points_pass_up')->default(true)->after('pays_direct_bonus');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['is_leader', 'power_leg_points', 'roi_enabled', 'pays_direct_bonus', 'points_pass_up']);
        });
    }
};
