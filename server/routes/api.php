<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;


Route::post('/auth/login', [AuthController::class, 'login'])->middleware(['throttle:10,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::get('/check-auth', 'check_auth');
        Route::post('/logout', 'logout');
    });
        Route::prefix('user')->controller(UserController::class)->group(function () {
        Route::get('/user-information', 'user_information');
    });
      Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::get('/list', 'all_products');
        Route::get('/all-categories', 'all_categories');
        Route::get('/stats', 'product_stats');
        Route::get('/details/{product_id}', 'product_details');
        Route::post('/create-category', 'create_category');
        Route::post('/create-product', 'create_product');
        Route::post("/upload-thumbnail", "upload_thumbnail");
         Route::patch('/edit-product/{product_id}', 'edit_product');
    });

    Route::prefix('inventory')->controller(InventoryController::class)->group(function () {
        Route::get('/list', 'all_inventories');
        Route::post('/add-inventory', 'add_inventory');
    });
});


