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
            $table->json('status_history')->nullable()->after('status')->comment('History of status changes');
            $table->timestamp('status_changed_at')->nullable()->after('status_history')->comment('When current status was set');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_assets', function (Blueprint $table) {
            $table->dropColumn(['status_history', 'status_changed_at']);
        });
    }
};
