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
            $table->json('notes')->nullable()->after('comments_history')->comment('Timestamped notes with date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_assets', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};
