<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [AssetController::class, 'dashboard'])->name('dashboard');
    
    // Employee routes - view only for users
    Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('employees/create', [EmployeeController::class, 'create'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('employees.create');
    Route::post('employees', [EmployeeController::class, 'store'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('employees.store');
    Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::get('employees/{employee}/edit', [EmployeeController::class, 'edit'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('employees.edit');
    Route::put('employees/{employee}', [EmployeeController::class, 'update'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('employees.update');
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('employees.destroy');
    
    // Asset routes - view only for users
    Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
    Route::get('assets/create', [AssetController::class, 'create'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.create');
    Route::post('assets', [AssetController::class, 'store'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.store');
    Route::get('assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
    Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.edit');
    Route::put('assets/{asset}', [AssetController::class, 'update'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.update');
    Route::delete('assets/{asset}', [AssetController::class, 'destroy'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.destroy');
    
    Route::post('assets/{asset}', [AssetController::class, 'update'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.update.post');
    Route::post('assets/{asset}/comments', [AssetController::class, 'addComment'])
        ->middleware(\App\Http\Middleware\BlockUserModifications::class)
        ->name('assets.comments');
    
    Route::get('lookups', [\App\Http\Controllers\LookupController::class, 'index'])
        ->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)
        ->name('lookups.index');
    
    // User management routes (admin only)
    Route::middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
});

// Route to serve private storage files (e.g., logo)
Route::get('storage/private/{filename}', function ($filename) {
    $path = storage_path('app/private/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    $file = Storage::disk('local')->get($filename);
    $type = mime_content_type($path) ?: 'application/octet-stream';
    
    return Response::make($file, 200, [
        'Content-Type' => $type,
        'Content-Disposition' => 'inline; filename="' . $filename . '"',
    ]);
})->name('storage.private');

require __DIR__.'/auth.php';