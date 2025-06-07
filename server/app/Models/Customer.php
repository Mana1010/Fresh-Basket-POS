<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'customer_id');
    }
    public function ratings()
    {
        return $this->hasMany(Invoice_Rating::class, 'customer_id');
    }
}
