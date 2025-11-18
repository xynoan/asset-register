<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LookupController;  // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('employees', EmployeeController::class);
    Route::post('employees/{id}/restore', [EmployeeController::class, 'restore'])->name('api.employees.restore');
    
    // Add asset routes - the controller already supports API requests
    Route::apiResource('assets', AssetController::class);
    Route::post('assets/{id}/restore', [AssetController::class, 'restore'])->name('api.assets.restore');
});

// Lookup routes (no authentication required, or add auth:sanctum if needed)
Route::get('lookups/categories', [LookupController::class, 'categories'])->name('lookups.categories');
Route::get('lookups/brands', [LookupController::class, 'brands'])->name('lookups.brands');
Route::get('lookups/suppliers', [LookupController::class, 'suppliers'])->name('lookups.suppliers');
Route::post('lookups/categories', [LookupController::class, 'storeCategory'])->name('lookups.categories.store');
Route::post('lookups/brands', [LookupController::class, 'storeBrand'])->name('lookups.brands.store');
Route::post('lookups/suppliers', [LookupController::class, 'storeSupplier'])->name('lookups.suppliers.store');
Route::delete('lookups/categories/{id}', [LookupController::class, 'deleteCategory'])->name('lookups.categories.delete');
Route::delete('lookups/brands/{id}', [LookupController::class, 'deleteBrand'])->name('lookups.brands.delete');
Route::delete('lookups/suppliers/{id}', [LookupController::class, 'deleteSupplier'])->name('lookups.suppliers.delete');
