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
        Schema::create('invoice_ratings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignUuid('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->integer('rating')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_ratings');
    }
};
