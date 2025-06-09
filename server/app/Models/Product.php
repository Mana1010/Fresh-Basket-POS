<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_name',
        'barcode',
        'price',
        'sku',
        'stock',
        'product_thumbnail',
        'product_category_id',
        'tax_rate',
        'discount_rate',
        'manufacturer',
        'is_deleted',
    ];
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'product_id');
    }
    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'product_id');
    }

}
