<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    public function customer () {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function orders () {
        return $this->hasMany(Order::class, 'invoice_id');
    }
    public function invoice_rating () {
        return $this->hasOne(Invoice_Rating::class, 'invoice_id');
    }
}
