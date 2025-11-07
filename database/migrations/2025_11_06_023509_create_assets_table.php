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
        Schema::create('tbl_assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_id')->unique()->comment('Auto-generated: A#00001, A#00002');
            $table->string('asset_category')->comment('Keyboard, Mouse, Monitor, Printer, etc.');
            $table->string('brand_manufacturer');
            $table->string('model_number');
            $table->string('serial_number');
            $table->date('purchase_date');
            $table->string('vendor_supplier')->nullable();
            $table->date('warranty_expiry_date')->nullable();
            $table->enum('status', ['In-use', 'Spare', 'Under Maintenance', 'Retired'])->default('Spare');
            $table->text('maintenance_history')->nullable();
            $table->json('comments_history')->nullable()->comment('Timestamped log of comments');
            $table->json('document_paths')->nullable()->comment('File paths for invoices, warranty, manuals');
            $table->unsignedBigInteger('assigned_to')->nullable()->comment('Employee ID');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('deleted_at')->nullable();
            
            // Foreign key constraint
            $table->foreign('assigned_to')->references('id')->on('tbl_employees')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_assets');
    }
};
