<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => $this->faker->numberBetween(2, 30),
            'type' => 'in',
            'financial_impact' => $this->faker->randomFloat(2, 10, 30000),
            'stock' => $this->faker->numberBetween(1, 1000),
            'reason' => 'supplier_delivery',
            'is_deleted' => false,
        ];
    }
}
