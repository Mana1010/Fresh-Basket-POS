<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['customer_id', 'product_id', 'invoice_id', 'quantity', 'total_price'];
    //The user who made the order
    public function customer () {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    //The user who served the order
    public function product () {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function invoice () {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}

