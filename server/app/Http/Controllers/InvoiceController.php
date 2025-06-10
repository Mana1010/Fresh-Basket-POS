<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Inventory;
use App\Models\Invoice;
use App\Models\InvoiceRating;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Google\Service\Datastream\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class InvoiceController extends Controller
{

public function receipt_list(Request $request)
{
    $limit = $request->query('limit', 10);
    $search = $request->query('search');
    $sort = $request->query('sort');
    $sort_total_amount = $request->query('sort_total_amount');
    $receipts = Invoice::with([
            'customer:id,name',
            'cashier:id,employer_name',
            'ratings',
        ])
        ->withSum('orders', 'total_price')
      ->leftJoin('customers', 'invoices.customer_id', '=', 'customers.id')
        ->when($search, function  ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_code', 'like', "%{$search}%")
                  ->orWhere('customers.name', 'like', "%{$search}%")
                  ->orWhereHas('cashier', function ($subQuery) use ($search) {
                      $subQuery->where('employer_name', 'like', "%{$search}%");
                  });
            });
        });

        if($sort_total_amount === '' && ($sort === 'desc' || $sort === 'asc')) {
          $receipts->orderBy('customers.name', $sort)
             ->select('invoices.*')
             ->selectRaw('SUM(orders.total_price) as orders_sum_total_price')
             ->leftJoin('orders', 'invoices.id', '=', 'orders.invoice_id')
             ->groupBy('invoices.id');
            }
        else {
      $receipts->orderBy('created_at', 'desc');
        }
       $data = $receipts->simplePaginate($limit);
    return response()->json(['data' => $data], 200);
}
    public function print_receipt(Request $request) {
    $validated = $request->validate([
    'customer_name' => ['nullable', 'string', 'max:255'],
    'customer_email' => ['required', 'email', 'max:1000'],
    'customer_paid' => ['required', 'numeric'],
    'cashier_id' => ['required', 'integer', 'exists:users,id'],
]);
try {
    $customer = Customer::where('email', $validated['customer_email'])->first();
    $customer_id = $customer?->id;

    $orders = $request->input('orders');
    $invoice_id = null; //initial
    DB::transaction(function () use ($orders, $validated, &$customer, &$customer_id, &$invoice_id) {
        $products = Product::withSum('inventories', 'stock')->get()->keyBy('id');

        // Pre-check all stocks
        foreach ($orders as $order) {
            $product_id = $order['id'];

            if (!isset($products[$product_id])) {
                throw new \Exception("Product with ID $product_id not found.");
            }

            $stockPerProduct = $order['inventories_sum_stock'];
            $availableStock = $products[$product_id]->inventories_sum_stock;

            if ($availableStock < $stockPerProduct) {
                $product_name = $products[$product_id]->product_name;
                throw new \Exception("Insufficient stock for $product_name: only $availableStock units left.");
            }
        }
      if (!$customer) {
            $customer = Customer::create([
                'email' => $validated['customer_email'],
                'name' => $validated['customer_name'],
            ]);
            $customer_id = $customer->id;
            $customer = $customer->name;
        } else {
        if($customer->name !== $validated['customer_name']) {
            $customer->update(['name' => $validated['customer_name']]);
        };
        }

        // Create customer if not exists



        // Create one invoice
        $invoice = Invoice::create([
            'customer_id' => $customer_id,
            'user_id' => $validated['cashier_id'],
            'customer_paid' => $validated['customer_paid'],
            'total_amount' => 0, // temporary, update after loop
        ]);
        $invoice_id = $invoice->id;
        $totalAmount = 0;

        foreach ($orders as $order) {
            $product_id = $order['id'];
            $tax_rate = $order['tax_rate'] / 100;
            $discount_rate = $order['discount_rate'] / 100;
            $stockPerProduct = $order['inventories_sum_stock'];
            $subtotal = $order['price'] * $stockPerProduct;
            $total_price = ($subtotal * (1 - $discount_rate)) * (1 + $tax_rate);

            $totalAmount += $total_price;

            Order::create([
                'customer_id' => $customer_id,
                'product_id' => $product_id,
                'invoice_id' => $invoice->id,
                'quantity' => $stockPerProduct,
                'price' => $order['price'],
                'total_price' => round($total_price, 2),
            ]);

            Inventory::create([
                'product_id' => $product_id,
                'type' => 'out',
                'financial_impact' => $totalAmount,
                'stock' => -$stockPerProduct,
                'reason' => 'customer_sale',
            ]);
        }

        // Update the invoice with the real total
       $invoice->update(['total_amount' => round($totalAmount, 2)]);
    });

    return response()->json(['message' => 'Order processed successfully', 'invoice_id' => $invoice_id]);
} catch (\Throwable $e) {
    return response()->json(['message' => $e->getMessage()], 422);
}
}
public function rate(Request $request) {
    $validated = $request->validate([
        'rating' => ['numeric', 'required', 'min:0', 'max:5'],
        'invoice_id' => ['required', 'numeric', 'exists:invoices,id'],
    ]);
try {

    InvoiceRating::create([
        'rating' => $validated['rating'],
        'invoice_id' => $validated['invoice_id'],
    ]);
    return response()->json(['Thank you for your feedback⭐'], 201);
}
catch(Validation $err ) {
    return response()->json(['message' => $err->getMessage()], 422);
}

}
};
