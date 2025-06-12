<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function total_sales(Request $request) {
        $total = Order::sum('total_price');
        return response()->json(['stat' => $total], 200);
    }

    public function total_product_sold() {
        $total = Order::sum('quantity');
      return response()->json(['stat' => $total], 200);
    }
public function best_seller_product() {
    $bestSeller = DB::table('orders')
        ->join('products', 'orders.product_id', '=', 'products.id')
        ->select('products.id', 'products.product_name', 'products.sku', DB::raw('SUM(orders.quantity) as total_sold'))
        ->groupBy('products.id')
        ->orderBy('total_sold', 'desc')
        ->first();

    return response()->json(['stat' => ['product_name' => $bestSeller->product_name, 'total_sold' => $bestSeller->total_sold, 'sku' => $bestSeller->sku]], 200);
}
public function least_seller_product() {
      $leastSeller = DB::table('orders')
        ->join('products', 'orders.product_id', '=', 'products.id')
        ->select('products.id', 'products.product_name', 'products.sku', DB::raw('SUM(orders.quantity) as total_sold'))
        ->groupBy('products.id')
        ->orderBy('total_sold', 'asc')
        ->first();

    return response()->json(['stat' => ['product_name' => $leastSeller->product_name, 'total_sold' => $leastSeller->total_sold, 'sku' => $leastSeller->sku]], 200);
}

public function highest_rating_cashier() {
    $highestRating = DB::table('invoices')
        ->leftJoin('invoice_ratings', 'invoice_ratings.invoice_id', '=', 'invoices.id')
        ->leftJoin('users', 'users.id', '=', 'invoices.user_id')  // Join users table
        ->select([
            'users.id as user_id',
            'users.employer_name as cashier_name',
            'users.username',
            DB::raw('SUM(invoice_ratings.rating) as total_stars')  // Fixed table name and column
        ])
        ->where('users.role', 'cashier')  // Filter only cashiers
        ->groupBy('users.id', 'users.employer_name', 'users.username')  // Group by user, not invoice
        ->orderBy('total_stars', 'desc')  // DESC for highest first
       ->limit(3)->get();  // Don't forget to execute the query
    return response()->json(['stats' => $highestRating], 200);
}
}
