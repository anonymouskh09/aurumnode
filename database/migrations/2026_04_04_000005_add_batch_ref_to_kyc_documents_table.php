<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kyc_documents', function (Blueprint $table) {
            $table->string('batch_ref', 64)->nullable()->after('file_path');
            $table->index(['user_id', 'batch_ref']);
        });
    }

    public function down(): void
    {
        Schema::table('kyc_documents', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'batch_ref']);
            $table->dropColumn('batch_ref');
        });
    }
};

