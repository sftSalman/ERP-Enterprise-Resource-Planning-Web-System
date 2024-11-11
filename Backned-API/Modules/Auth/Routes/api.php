<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\ActivityLogController;
use Modules\Auth\Http\Controllers\LoginController;
use Modules\Auth\Http\Controllers\LogoutController;
use Modules\Auth\Http\Controllers\MenuController;
use Modules\Auth\Http\Controllers\PermissionsController;
use Modules\Auth\Http\Controllers\ProfileController;
use Modules\Auth\Http\Controllers\ResetPasswordController;
use Modules\Auth\Http\Controllers\RolesController;
use Modules\Auth\Http\Controllers\DashboardController;

Route::post('login', [LoginController::class, 'login']);
Route::post('otp', [LoginController::class, 'otpSend']);
Route::post('otp-check', [LoginController::class, 'checkOtp']);
Route::post('user-check', [ResetPasswordController::class, 'checkUserValidity']);
Route::post('reset-password', [ResetPasswordController::class, 'resetPassword']);

Route::middleware('auth:api')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('logout', [LogoutController::class, 'logout']);

    Route::get('roles/permissions', [PermissionsController::class, 'index']);
    Route::get('dashboard/counting', [DashboardController::class, 'getDashboardCounting']);
    Route::apiResource('roles', RolesController::class);
    Route::get('permissions', [RolesController::class, 'dropdown']);
    Route::get('roles/dropdown/list', [RolesController::class, 'dropdown']);

    Route::get('menu', [MenuController::class, 'index']);
    Route::get('activity-log', [ActivityLogController::class, 'index']);
});
