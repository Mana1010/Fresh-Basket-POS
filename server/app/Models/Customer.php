<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Customer extends Model
{
    protected $fillable = ['name', 'email', 'total_spent'];
        public function setNameAttribute($value)
    {
        $this->attributes['name'] = Crypt::encryptString($value);
    }

    // Decrypt name when accessing
    public function getNameAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    // Encrypt email before saving
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = Crypt::encryptString($value);
    }

    // Decrypt email when accessing
    public function getEmailAttribute($value)
    {
        return Crypt::decryptString($value);
    }
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'customer_id');
    }
}
