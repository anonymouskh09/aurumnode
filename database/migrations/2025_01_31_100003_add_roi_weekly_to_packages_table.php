<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Weekly ROI % per package (admin-configurable). */
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->decimal('roi_weekly_percent', 5, 2)->nullable()->after('roi_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('roi_weekly_percent');
        });
    }
};
