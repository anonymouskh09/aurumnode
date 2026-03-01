<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->foreignId('sponsor_id')->nullable()->after('email_verified_at')->constrained('users')->nullOnDelete();
            $table->string('placement_side', 10)->nullable()->after('sponsor_id'); // 'left' or 'right'
            $table->string('status', 20)->default('free')->after('placement_side'); // 'free' or 'paid'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['sponsor_id']);
            $table->dropColumn(['username', 'sponsor_id', 'placement_side', 'status']);
        });
    }
};
