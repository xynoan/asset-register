<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [AssetController::class, 'dashboard'])->name('dashboard');
    
    Route::resource('employees', EmployeeController::class);
    Route::resource('assets', AssetController::class);
    
    Route::post('assets/{asset}', [AssetController::class, 'update'])->name('assets.update.post');
    Route::post('assets/{asset}/comments', [AssetController::class, 'addComment'])->name('assets.comments');
    
    Route::get('lookups', [\App\Http\Controllers\LookupController::class, 'index'])->name('lookups.index');
    
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