<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice_Rating extends Model
{
    public function invoice () {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}
