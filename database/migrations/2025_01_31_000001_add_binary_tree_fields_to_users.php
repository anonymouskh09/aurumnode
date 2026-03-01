<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('left_child_id')->nullable()->after('placement_side')->constrained('users')->nullOnDelete();
            $table->foreignId('right_child_id')->nullable()->after('left_child_id')->constrained('users')->nullOnDelete();
            $table->foreignId('binary_parent_id')->nullable()->after('right_child_id')->constrained('users')->nullOnDelete();
            $table->decimal('left_points_total', 18, 2)->default(0)->after('binary_parent_id');
            $table->decimal('right_points_total', 18, 2)->default(0)->after('left_points_total');
            $table->boolean('is_admin')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['left_child_id']);
            $table->dropForeign(['right_child_id']);
            $table->dropForeign(['binary_parent_id']);
            $table->dropColumn(['left_child_id', 'right_child_id', 'binary_parent_id', 'left_points_total', 'right_points_total', 'is_admin']);
        });
    }
};
