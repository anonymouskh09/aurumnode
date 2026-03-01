<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('display_name', 100)->nullable()->after('name');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('investment_wallet', 18, 2)->default(0)->after('deposit_wallet');
        });

        \Illuminate\Support\Facades\DB::table('packages')->whereNull('display_name')->update([
            'display_name' => \Illuminate\Support\Facades\DB::raw('name'),
        ]);
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('display_name');
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('investment_wallet');
        });
    }
};
