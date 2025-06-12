<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MakeComService
{
    protected $webhookUrl;

    public function __construct()
    {
        $this->webhookUrl = config('services.make_com') ?? env('MAKE_COM_WEBHOOK_URL');

   Log::info('MakeComService initialized', [
        'webhook_url' => $this->webhookUrl,
        'env_value' => env('MAKE_COM_WEBHOOK_URL'),
        'config_value' => config('services.make_com')
    ]);
    }


    public function sendToGoogleSheets($data, $action = 'add_product')
    {
        try {
            $payload = [
                'action' => $action,
                'timestamp' => now()->toISOString(),
                'data' => $data
            ];

            $response = Http::post($this->webhookUrl, $payload);

            if ($response->successful()) {
                Log::info('Successfully sent data to Make.com', [
                    'action' => $action,
                    'product_id' => $data['id'] ?? null
                ]);
                return true;
            }

            Log::error('Make.com webhook failed', [
                'status' => $response->status(),
                'response' => $response->body(),
                'data' => $payload
            ]);

            return false;

        } catch (\Exception $e) {
            Log::error('Make.com service error', [
                'message' => $e->getMessage(),
                'data' => $data
            ]);
            return false;
        }
    }

    // Alternative method for specific product updates
    public function updateProductInSheet($productId, $updates)
    {
        $product = Product::with('category')->find($productId);

        if (!$product) {
            return false;
        }

        $data = [
            'id' => $product->id,
            'product_name' => $product->product_name,
            'price' => $product->price,
            'barcode' => $product->barcode,
            'sku' => $product->sku,
            'category' => $product->category->category_name ?? 'Unknown',
            'discount_rate' => $product->discount_rate,
            'tax_rate' => $product->tax_rate,
            'manufacturer' => $product->manufacturer,
            'updated_at' => $product->updated_at->format('Y-m-d H:i:s'),
        ];

        return $this->sendToGoogleSheets($data, 'update_product');
    }
}
