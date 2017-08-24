<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
//    return view('welcome');
    echo md5('240610708'), '<br />', md5('QNKCDZO');
    dd(md5('240610708') === md5('QNKCDZO'));
});

/*邮件*/
Route::get('mail/send','MailController@send');

/*短信测试*/
Route::get('/client', 'SocketControllerol@client');
Route::get('/testSendSms', 'SocketControllerol@testSendSms');

Route::get('/index', 'IndexControllerol@index');
Route::get('/index/logout', 'IndexControllerol@logout');
Route::get('/index/register', 'IndexControllerol@register');
Route::get('/index/check-email', 'IndexControllerol@checkEmail');


/*产品和应用*/
Route::group(['namespace' => 'Realme'], function()
{
    // Controllers Within The "App\Http\Controllers\Realme" Namespace

    Route::group(['prefix' => 'demo'], function() {
        Route::get('/index', 'DemoController@index');	//试用首页
    });

    Route::group(['prefix' => 'application'], function() {
        Route::get('/index', 'ApplicationController@index');	//应用首页
    });
});