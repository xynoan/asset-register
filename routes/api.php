<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\EmployeeController;
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
