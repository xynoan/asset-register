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
        Schema::table('tbl_assets', function (Blueprint $table) {
            $table->json('modification_history')->nullable()->after('notes')->comment('Timestamped log of all field modifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_assets', function (Blueprint $table) {
            $table->dropColumn('modification_history');
        });
    }
};
