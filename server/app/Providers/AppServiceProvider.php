<?php

namespace App\Providers;

use App\Services\MakeComService;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(MakeComService::class, function ($app) {
            return new MakeComService();
        });
    }
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
        URL::forceScheme('https');
    }
    }
}
