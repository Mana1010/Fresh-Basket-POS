<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function add_inventory(Request $request) {
        $validated = $request->validate([
           'product_id' => 'required|exists:products,id',
           'type' => 'required|in:in,out',
           'reason' => 'required|in:customer_sale,supplier_delivery,damaged_or_spoiled',
           'stock' => 'required|numeric',
        ]);

        Inventory::create([
            'product_id' => $validated['product_id'],
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'stock' => $validated['stock'],
        ]);

    return response()->json(['message' => 'Successfully added new inventory'], 201);
    }

    public function all_inventories(Request $request) {
        $limit = $request->query('limit');
$inventories = DB::table('inventories')
    ->join('products', 'inventories.product_id', '=', 'products.id')
    ->select('inventories.*', 'products.price', 'products.tax_rate', 'products.product_name', 'products.sku')
    ->selectRaw('(inventories.stock * (products.price * (1 + products.tax_rate / 100))) AS financial_impact')->orderBy('updated_at', 'desc')
    ->simplePaginate($limit ?? 10);
        return response()->json(['data' => $inventories], 200);
    }

}
