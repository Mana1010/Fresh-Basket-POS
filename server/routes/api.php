<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/auth/login', [AuthController::class, 'login'])->middleware(['throttle:10,1']);
 Route::get('/auth/check-auth', [AuthController::class, 'check_auth']);
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        // Route::get('/check-auth', 'check_auth');
        Route::post('/logout', 'logout');
    });
        Route::prefix('user')->controller(UserController::class)->group(function () {
        Route::get('/user-information', 'user_information');
    });

       Route::prefix('account')->controller(UserController::class)->group(function () {
        Route::get('/stats', 'account_stats');
        Route::get('/list', 'all_accounts');
        Route::get('/account-details/{account_id}', 'account_details');
        Route::post('/create-account', 'add_account');
         Route::patch('/edit-account/{account_id}', 'edit_account');
            Route::patch('toggle-status-account/{account_id}', 'toggle_status_account');

    });
      Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::get('/list', 'all_products');
        Route::get('/all-categories', 'all_categories');
        Route::get('/stats', 'product_stats');
        Route::get('/details/{product_id}', 'product_details');
        Route::post('/create-category', 'create_category');
          Route::patch('/edit-category/{category_name}', 'edit_category');
        Route::post('/create-product', 'create_product');
        Route::post("/upload-thumbnail", "upload_thumbnail");
         Route::patch('/edit-product/{product_id}', 'edit_product');
         Route::delete('/delete-category/{category_name}', 'delete_category');
    });

    Route::prefix('inventory')->controller(InventoryController::class)->group(function () {
        Route::get('/list', 'all_inventories');
         Route::get('/inventory-details/{inventory_id}', 'inventory_details');
        Route::post('/add-inventory', 'add_inventory');
         Route::patch('/edit-inventory/{inventory_id}', 'edit_inventory');

    });
        Route::prefix('invoice')->controller(InvoiceController::class)->group(function () {
            Route::post('/print-receipt', 'print_receipt');
            Route::get("/list", "receipt_list");
    });
});


