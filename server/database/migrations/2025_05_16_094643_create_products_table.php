<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        //For Product Creation
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('product_name');
            $table->string('barcode')->unique();
            $table->foreignId('product_category_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->decimal('price', 10, 2);
            $table->string('sku')->unique();
            $table->string('product_thumbnail')->nullable();

        });



        //For Product Category Creation

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
