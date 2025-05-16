<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //The user who made the order
    public function customer () {
        return $this->belongsTo(Customer::class, 'order_id');
    }

    //The user who served the order
    public function product () {
        return $this->belongsTo(User::class, 'product_id');
    }

    public function invoice () {
        return $this->hasOne(Invoice::class, 'order_id');
    }
}

