<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;
    protected $fillable = ["stock", "type", "reason", "created_at", "product_id", "financial_impact"];
    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
