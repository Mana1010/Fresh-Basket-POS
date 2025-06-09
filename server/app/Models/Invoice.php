<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Invoice extends Model
{
    protected $fillable = ["customer_id", "user_id", "customer_paid", "is_deleted"];

    protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        $model->invoice_code = 'FB-' . self::generateInvoiceCode();
    });
}

    public static function generateInvoiceCode()
    {
        do {
            $code = Str::upper(Str::random(7));
        } while (self::where('invoice_code', $code)->exists());

        return $code;
    }
    public function customer () {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
    public function cashier() {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function orders () {
        return $this->hasMany(Order::class, 'invoice_id');
    }
    public function ratings () {
        return $this->hasOne(InvoiceRating::class, 'invoice_id');
    }
}
