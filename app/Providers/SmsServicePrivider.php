<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;


class SmsServicePrivider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('App\Contracts\SmsContract',function(){
            return new \App\Services\SmsService();
        });
    }
}
