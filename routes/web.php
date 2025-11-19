<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::resource('employees', EmployeeController::class);
Route::resource('assets', AssetController::class);

Route::post('assets/{asset}', [AssetController::class, 'update'])->name('assets.update.post');
Route::post('assets/{asset}/comments', [AssetController::class, 'addComment'])->name('assets.comments');

require __DIR__.'/auth.php';