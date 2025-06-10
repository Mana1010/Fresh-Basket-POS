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
      $product = Product::findOrFail($validated['product_id']);
       $total_amount = $validated['stock'] * ($product->price * (1 - ($product->discount_rate / 100))) * (1 + ($product->tax_rate / 100));
        Inventory::create([
            'product_id' => $validated['product_id'],
            'type' => $validated['type'],
            'financial_impact' => $total_amount,
            'reason' => $validated['reason'],
            'stock' => $validated['stock'],
        ]);

    return response()->json(['message' => 'Successfully added new inventory'], 201);
    }

public function all_inventories(Request $request) {
    $limit = $request->query('limit', 10);
    $search = $request->query('search');
    $reason = $request->query('reason');

    $query = DB::table('inventories')
        ->join('products', 'inventories.product_id', '=', 'products.id')
        ->select('inventories.*', 'products.price', 'products.tax_rate', 'products.product_name', 'products.sku', 'products.product_thumbnail')
        ->orderBy('inventories.updated_at', 'desc');

    // Add search filter if exists
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('products.product_name', 'like', "%{$search}%")
              ->orWhere('products.sku', 'like', "%{$search}%");
        });
    }
    // Add reason filter if exists
    if ($reason) {
        $query->where('reason', $reason);
    }

    $inventories = $query->simplePaginate($limit);

    return response()->json(['data' => $inventories], 200);
}


    public function inventory_details($inventory_id) {
        $inventory = Inventory::with(['product:id,product_name,barcode,sku'])->find($inventory_id);
        $product_stock = Product::withSum('inventories', 'stock')->get();
        $stock = 0;

        foreach ($product_stock as $product) {
                $stock = $product->inventories_sum_stock;
        };
        if (!$inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        return response()->json(['data' => $inventory, 'product_stock' => $stock], 200);
    }
        public function edit_inventory(Request $request ,$inventory_id) {

         $validated = $request->validate([
           'product_id' => 'required|exists:products,id',
           'type' => 'required|in:in,out',
           'reason' => 'required|in:customer_sale,supplier_delivery,damaged_or_spoiled',
           'stock' => 'required|numeric',
        ]);
       $product = Product::select('price', 'tax_rate', 'discount_rate')
       ->findOrFail($validated['product_id']);
       $total_amount = $validated['stock'] * ($product->price * (1 - ($product->discount_rate / 100))) * (1 + ($product->tax_rate / 100));
     $inventory = Inventory::findOrFail($inventory_id);
    $inventory->financial_impact = $total_amount;
        $inventory->fill($validated);

        if($inventory->isDirty()) {
            $inventory->save();
        }
        return response()->json(['message' => 'Successfully updated the inventory'], 201);
    }

    public function inventory_stats (Request $request) {
        $type = $request->query('type');
           $stat = 0;
        if($type === "total_inventories") {
            $stat = Inventory::count();
        }
        else if ($type === "cumulative_stock_out_quantity") {
            $stat = Inventory::where('type', 'out')->selectRaw('SUM(ABS(stock)) as total')->value('total');
        }
        else if ($type === "cumulative_stock_in_quantity") {
             $stat = Inventory::where('type', 'in')->selectRaw('SUM(ABS(stock)) as total')->value('total');
        }
    return response()->json(['stat' => $stat], 200);
    }

}
