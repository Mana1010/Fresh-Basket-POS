<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceRating extends Model
{
     protected $table = 'invoice_ratings';
    protected $fillable = ['rating', 'invoice_id'];
    public function invoice () {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}
