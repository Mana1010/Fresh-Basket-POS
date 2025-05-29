<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
   return [
            // The name of the product (e.g., "Wireless Mouse")
            'product_name' => $this->faker->words(3, true),

            // A unique 13-digit barcode (EAN-13 format)
            'barcode' => $this->faker->unique()->ean13(),

            // The product price as a decimal with 2 decimal places, between 10 and 1000
            'price' => $this->faker->randomFloat(2, 10, 1000),

            // SKU (Stock Keeping Unit), an alphanumeric identifier (e.g., "ABC-12345")
            'sku' => strtoupper($this->faker->bothify('???-#####')),

            // 'product_thumbnail' => $this->faker->imageUrl(300, 300, 'products'),
            'product_thumbnail' => null,

            // Foreign key ID referring to a product category
            // Make sure to have seeded categories if using this
            // 'product_category_id' => $this->faker->numberBetween(1, 10),
            'product_category_id' => 1,

            // Tax rate applied to the product (e.g., 0.15 = 15%)
            'tax_rate' => $this->faker->numberBetween(1, 100),

            // Discount rate on the product (e.g., 0.10 = 10% discount)
            'discount_rate' => $this->faker->numberBetween(1, 100),

            // Name of the manufacturer or supplier (e.g., "Acme Corp.")
            'manufacturer' => $this->faker->company(),
        ];
    }
}
