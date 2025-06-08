<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductCategory;
use Cloudinary\Cloudinary as CloudinaryCloudinary;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Error;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use function Laravel\Prompts\select;

class ProductController extends Controller
{
    public function all_products (Request $request) {
        $limit = $request->query('limit');
          $search = $request->query('search');
          $type = $request->query('type');
          $sort = $request->query('sort');
        // $sort = $request->query('sort');
        // $filter = $request->query('filter');

        // $products = [];
        // if($sort === "default" || !$sort) {
        //  $products = Product::with('product_categories')->simplePaginate($limit);
        // }
    if($type === "pos_page") {
        $products = Product::with(['category:id,category_name'])->withSum('inventories', 'stock')->addSelect('id', 'barcode', 'product_name', 'sku', 'price', 'discount_rate', 'tax_rate', 'product_category_id')->get();
       return response()->json(['data' => $products], 200);
    }
$products = Product::with('category')
    ->where('product_name', 'like', "%$search%")
    ->orWhere('sku', 'like', "%$search%")
    ->orWhere('manufacturer', 'like', "%$search%")
    ->orWhere('barcode', 'like', "%$search%")
    ->withSum('inventories', 'stock');

if ($sort === "asc" || $sort === "desc") {
    $products->orderBy('price', $sort);
} else {
    $products->orderBy('created_at', 'desc');
}

$data = $products->simplePaginate(10);

return response()->json(['data' => $data], 200);
    }


    public function create_category(Request $request) {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:product_categories,category_name',
        ]);

          ProductCategory::create([
            'category_name' => $request->category_name,
        ]);

        return response()->json(['message' => 'Successfully added new category'], 201);
    }

    public function edit_category (Request $request, $category_name) {
        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('product_categories', 'category_name')->ignore($category_name, 'category_name'),
            ],

        ]);

        $category = ProductCategory::where('category_name', $category_name)->firstOrFail();
        $category->update(['category_name' => $validated['category_name']]);

        return response()->json(['message' => 'Successfully updated the category'], 201);
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
            $product_stat = Inventory::all()->sum('stock');
        }
        else if ($type === "total_amount") {
          $product_stat = DB::table('products')
       ->join('inventories', 'products.id', '=', 'inventories.product_id')
       ->selectRaw('SUM((products.price - (products.price * (products.discount_rate / 100)))
            * (1 + products.tax_rate / 100)
            * inventories.stock) as total_amount')
       ->value('total_amount');
        }
        else if ($type === "total_product_variants") {
            $product_stat = Product::count();
        }
        else {
            $product_stat = ProductCategory::count();
        }

    return response()->json(['stat' => $product_stat], 200);
    }

    public function product_details($product_id) {

        $product = Product::find($product_id);
        $product_categories = ProductCategory::all();

        return response()->json(['data' => ['product' => $product, 'categories' => $product_categories]], 200);
    }
    public function edit_product(Request $request ,$product_id) {

        $validated = $request->validate([
            'product_name' => 'required|string|max:1000',
            'price' => 'required|numeric',
               'barcode' => [
            'required',
            'string',
            'max:8',
            Rule::unique('products')->ignore($product_id),
        ],
        'sku' => [
            'required',
            'string',
            'max:1000',
            Rule::unique('products')->ignore($product_id),
        ],
            'product_category_id' => 'required|exists:product_categories,id',
            'discount_rate' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            'product_thumbnail' => 'nullable|string',
            'manufacturer' => 'nullable|string|max:1000',
        ]);
     $product = Product::findOrFail($product_id);
        $product->fill($validated);
        if($product->isDirty()) {
            $product->save();
        }
        return response()->json(['message' => 'Successfully updated the product'], 201);
    }
    public function delete_category($category_name) {

        ProductCategory::where('category_name', $category_name)->delete();

        return response()->json(['message' => 'Successfully deleted the category'], 201);
    }
}
