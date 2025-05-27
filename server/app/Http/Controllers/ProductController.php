<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

use function Laravel\Prompts\select;

class ProductController extends Controller
{
    public function all_products (Request $request) {
        $limit = $request->query('limit');
        $sort = $request->query('sort');
        $sorted_field = $request->query('sorted_field');
        $products = [];
        if($sort === "default" || !$sort || !$sorted_field) {
         $products = Product::all()->simplePaginate($limit);
        }
        else {
     $products = Product::all()->sortBy($sorted_field, $sort)->simplePaginate($limit ?? 10);
        }


    return response()->json(['data' => $products], 200);
    }

    public function create_category(Request $request) {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:product_categories,category_name',
        ]);

        $category = ProductCategory::create([
            'category_name' => $request->category_name,
        ]);

        return response()->json(['message' => 'Successfully added new category'], 201);
    }

    public function create_product(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:product_categories,id',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['data' => $product], 201);
    }

    public function all_categories() {
        $categories = ProductCategory::all();
        return response()->json(['categories' => $categories], 200);
    }
}
