<?php

use Illuminate\Support\Facades\Route;
use Modules\Hrm\Http\Controllers\ChildDivisionController;
use Modules\Hrm\Http\Controllers\DepartmentController;
use Modules\Hrm\Http\Controllers\EmployeesController;
use Modules\Hrm\Http\Controllers\DesignationController;
use Modules\Hrm\Http\Controllers\DivisionController;
use Modules\Hrm\Http\Controllers\SubDivisionController;

Route::middleware('auth:api')->group(function () {
    Route::get('employees/chart', [EmployeesController::class, 'chart']);
    Route::apiResource('employees', EmployeesController::class);
    Route::get('employees/dropdown/list', [EmployeesController::class, 'dropdown']);
    Route::get('seller-policy-report', [EmployeesController::class, 'sellerPolicyReport']);

    Route::apiResource('designations', DesignationController::class);
    Route::get('designations/dropdown/list', [DesignationController::class, 'dropdown']);

    Route::apiResource('departments', DepartmentController::class);
    Route::get('departments/dropdown/list', [DepartmentController::class, 'dropdown']);

    Route::apiResource('divisions', DivisionController::class);
    Route::get('divisions/dropdown/list', [DivisionController::class, 'dropdown']);

    Route::apiResource('sub-divisions', SubDivisionController::class);
    Route::get('sub-divisions/dropdown/list', [SubDivisionController::class, 'dropdown']);

    Route::apiResource('child-divisions', ChildDivisionController::class);
    Route::get('child-divisions/dropdown/list', [ChildDivisionController::class, 'dropdown']);
});
