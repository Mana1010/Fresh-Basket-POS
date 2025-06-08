<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
        //    {
        //   orders: orderProducts,
        //   customer_name: "",
        //   customer_email: "",
        //   sub_total: 0,
        //   discount_rate: 0,
        //   tax_rate: 0,
        //   total_amount: grand_total,
        //   customer_change: formatToPhpMoney(
        //     String(Number(watch("customer_paid")) - grand_total)
        //   ),
        //   customer_paid: 0,
        //   cashier_id: user?.id,
        // }
    public function print_receipt(Request $request) {
    $validated = $request->validate([
    'customer_name' => ['nullable', 'string', 'max:255'],
    'customer_email' => ['required', 'email', 'max:1000'],
    'sub_total' => ['required', 'numeric'],
    'discount_rate' => ['nullable', 'numeric'],
    'tax_rate' => ['nullable', 'numeric'],
    'total_amount' => ['required', 'numeric'],
    'customer_change' => ['nullable', 'numeric'],
    'customer_paid' => ['required', 'numeric'],
    'cashier_id' => ['required', 'integer', 'exists:users,id'],
]);
   $customer = Customer::where('email', $validated['customer_email'])->first();
   $customer_id = $customer->id;

     $orders = $request->input('orders');

      DB::transaction(function() use ($orders, $validated, $customer) {
           if(!$customer) {
           $customer = Customer::create([
            'email' => $validated['customer_email'],
            'name' => $validated['customer_email'],
        ]);
         $customer_id = $customer->id;
   }
            // Format data
            $orders = array_map(function($product) use ($customer_id) {
                $tax_rate = $product['tax_rate'] / 100;
                $discount_rate = $product['discount_rate'] / 100;
                $subtotal = $product['price'] * $product['inventories_sum_stock'];
                $total_price = ($subtotal * (1 - $discount_rate)) * (1 + $tax_rate);
                return [
                    'customer_id' => $customer_id,
                    'product_id' => $product['product_id'],
                    'quantity' => $product['inventories_sum_stock'], //the stock of ordered unit
                    'price' => $product['price'],
                    'total_price' => round($total_price, 2),
                ];
            }, $orders);
            // Bulk insert
            Order::insert($orders);


        });
}
};
