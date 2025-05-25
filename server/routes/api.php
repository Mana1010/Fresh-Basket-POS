<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/auth/login', [AuthController::class, 'login'])->middleware(['throttle:10,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::post('/logout', 'logout');
    });
        Route::prefix('user')->controller(UserController::class)->group(function () {
        Route::get('/user-information', 'user_information');
    });
      Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::get('/list', 'all_products');
    });
});


