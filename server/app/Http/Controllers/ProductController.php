<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

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
}
