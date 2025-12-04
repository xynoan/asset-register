<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LookupController;
use Illuminate\Support\Facades\Route;

Route::apiResource('employees', EmployeeController::class);
Route::post('employees/{id}/restore', [EmployeeController::class, 'restore'])->name('api.employees.restore');

Route::apiResource('assets', AssetController::class);
Route::post('assets/{id}/restore', [AssetController::class, 'restore'])->name('api.assets.restore');

Route::get('lookups/categories', [LookupController::class, 'categories'])->name('lookups.categories');
Route::get('lookups/brands', [LookupController::class, 'brands'])->name('lookups.brands');
Route::get('lookups/suppliers', [LookupController::class, 'suppliers'])->name('lookups.suppliers');
Route::post('lookups/categories', [LookupController::class, 'storeCategory'])->name('lookups.categories.store');
Route::post('lookups/brands', [LookupController::class, 'storeBrand'])->name('lookups.brands.store');
Route::post('lookups/suppliers', [LookupController::class, 'storeSupplier'])->name('lookups.suppliers.store');
Route::delete('lookups/categories/{id}', [LookupController::class, 'deleteCategory'])->name('lookups.categories.delete');
Route::delete('lookups/brands/{id}', [LookupController::class, 'deleteBrand'])->name('lookups.brands.delete');
Route::delete('lookups/suppliers/{id}', [LookupController::class, 'deleteSupplier'])->name('lookups.suppliers.delete');
Route::put('lookups/categories/{id}', [LookupController::class, 'updateCategory'])->name('lookups.categories.update');
Route::put('lookups/brands/{id}', [LookupController::class, 'updateBrand'])->name('lookups.brands.update');
Route::put('lookups/suppliers/{id}', [LookupController::class, 'updateSupplier'])->name('lookups.suppliers.update');
Route::get('lookups/{type}/{id}/assets', [LookupController::class, 'getAssetsByLookup'])->name('lookups.assets');