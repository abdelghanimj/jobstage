<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobOfferController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminSettingController;
use App\Http\Controllers\Api\CandidateProfileController;


// Public routes - Home page
Route::get('/offers', [JobOfferController::class, 'publicIndex']);
Route::get('/offers/latest', [JobOfferController::class, 'latest']);
Route::get('/companies', [App\Http\Controllers\Api\CompanyProfileController::class, 'publicIndex']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/offers/{id}', [
    App\Http\Controllers\Api\JobOfferController::class,
    'publicShow'
]);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/users',[App\Http\Controllers\Api\AdminUserController::class, 'index']);
    Route::delete('/admin/users/{id}', [App\Http\Controllers\Api\AdminUserController::class, 'destroy']);
    Route::put('/admin/users/{id}', [App\Http\Controllers\Api\AdminUserController::class, 'update']);
    Route::get('admin/offers', [JobOfferController::class, 'index']);
    Route::get('admin/offers/stats', [JobOfferController::class, 'stats']);
    Route::patch('admin/offers/{id}/status', [JobOfferController::class, 'updateStatus']);
    Route::delete('admin/offers/{id}', [JobOfferController::class, 'destroy']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('company-profiles', App\Http\Controllers\Api\CompanyProfileController::class);
    // Admin settings routes
    Route::get('/admin/settings', [AdminSettingController::class, 'show']);
Route::put('/admin/settings', [AdminSettingController::class, 'update']);
// Candidate profile routes
Route::get('/candidate/profile', [CandidateProfileController::class, 'show']);
Route::put('/candidate/profile', [CandidateProfileController::class, 'update']);
Route::post(
    '/candidate/profile/cv',
    [CandidateProfileController::class, 'uploadCv']
);

});
