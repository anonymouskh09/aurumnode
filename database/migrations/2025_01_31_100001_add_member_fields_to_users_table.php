<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Add full member details and block flag for admin control. */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('mobile', 30)->nullable()->after('email');
            $table->string('country', 100)->nullable()->after('mobile');
            $table->string('city', 100)->nullable()->after('country');
            $table->text('address')->nullable()->after('city');
            $table->boolean('is_blocked')->default(false)->after('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['mobile', 'country', 'city', 'address', 'is_blocked']);
        });
    }
};
