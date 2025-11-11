<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EmployeeController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('employees', EmployeeController::class);
Route::post('employees/{id}/restore', [EmployeeController::class, 'restore'])->name('employees.restore');

Route::resource('assets', AssetController::class);
// Allow POST with method spoofing for file uploads in updates
Route::post('assets/{asset}', [AssetController::class, 'update'])->name('assets.update.post');
Route::post('assets/{id}/restore', [AssetController::class, 'restore'])->name('assets.restore');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
