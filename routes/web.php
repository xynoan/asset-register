<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LookupController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EmployeeController::class, 'index']);

Route::get('/dashboard', [AssetController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('employees', EmployeeController::class);
Route::post('employees/{id}/restore', [EmployeeController::class, 'restore'])->name('employees.restore');

Route::resource('assets', AssetController::class);
// Allow POST with method spoofing for file uploads in updates
Route::post('assets/{asset}', [AssetController::class, 'update'])->name('assets.update.post');
Route::post('assets/{asset}/comments', [AssetController::class, 'addComment'])->name('assets.comments');
Route::post('assets/{id}/restore', [AssetController::class, 'restore'])->name('assets.restore');

// Lookup routes
Route::get('api/lookups/categories', [LookupController::class, 'categories'])->name('lookups.categories');
Route::get('api/lookups/brands', [LookupController::class, 'brands'])->name('lookups.brands');
Route::get('api/lookups/suppliers', [LookupController::class, 'suppliers'])->name('lookups.suppliers');
Route::post('api/lookups/categories', [LookupController::class, 'storeCategory'])->name('lookups.categories.store');
Route::post('api/lookups/brands', [LookupController::class, 'storeBrand'])->name('lookups.brands.store');
Route::post('api/lookups/suppliers', [LookupController::class, 'storeSupplier'])->name('lookups.suppliers.store');
Route::delete('api/lookups/categories/{id}', [LookupController::class, 'deleteCategory'])->name('lookups.categories.delete');
Route::delete('api/lookups/brands/{id}', [LookupController::class, 'deleteBrand'])->name('lookups.brands.delete');
Route::delete('api/lookups/suppliers/{id}', [LookupController::class, 'deleteSupplier'])->name('lookups.suppliers.delete');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
