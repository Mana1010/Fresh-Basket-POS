<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Cloudinary\Cloudinary as CloudinaryCloudinary;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


use function Laravel\Prompts\select;

class ProductController extends Controller
{
    public function all_products (Request $request) {
        $limit = $request->query('limit');
        // $sort = $request->query('sort');
        // $filter = $request->query('filter');

        // $products = [];
        // if($sort === "default" || !$sort) {
        //  $products = Product::with('product_categories')->simplePaginate($limit);
        // }

     $products = Product::with(['category' => function($query) {
        $query->select('id', 'category_name');
     }])->orderBy('product_name', 'asc')->simplePaginate(10);
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

    public function upload_thumbnail(Request $request) {
        $validated = $request->validate([
           'product_thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,webp',
        ]);
          $product_thumbnail = null;
        if($request->hasFile('product_thumbnail')) {
         $product_thumbnail = Cloudinary::upload($request->file('product_thumbnail')->getRealPath())->getSecurePath();

        }
        return response()->json(['secure_url' => $product_thumbnail], 201);

    }

    public function create_product(Request $request) {
       $validated = $request->validate([
            'product_name' => 'required|string|max:1000',
            'price' => 'required|numeric',
            'barcode' => 'required|string|max:8|unique:products,barcode',
            'sku' => 'required|string|max:1000|unique:products,sku',
            'product_category_id' => 'required|exists:product_categories,id',
            'discount_rate' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            'stock' => 'required|numeric',
            'product_thumbnail' => 'nullable|string',
            'manufacturer' => 'nullable|string|max:1000',
        ]);

           Product::create([
            'product_name' => $validated["product_name"],
            'price' => $validated["price"],
            'barcode' => $validated["barcode"],
            'sku' => $validated["sku"],
            'product_category_id' => $validated["product_category_id"],
            'discount_rate' => $validated["discount_rate"],
            'tax_rate' => $validated['tax_rate'],
            'stock' => $validated['stock'],
            'manufacturer' => $validated['manufacturer'],
            'product_thumbnail' => $validated['product_thumbnail'],
        ]);
         return response()->json(['message' => 'Successfully added your new product'], 201);

    }

    public function all_categories() {
        $categories = ProductCategory::all();
        return response()->json(['categories' => $categories], 200);
    }

    public function product_stats (Request $request) {
        $type = $request->query('type');
        $product_stat = 0;
        if($type === "total_products") {
            $product_stat = Product::count();
        }
        else if ($type === "total_amount") {
            $product_stat = DB::table('products')->selectRaw('SUM(price * stock) as total_amount')->value('total_amount');
        }
        else {
            $product_stat = ProductCategory::count();
        }

    return response()->json(['stat' => $product_stat], 200);
    }
}
