<?php
/**
 * 应用管理
 * @author kelly.wang
 * @date 2017.8.23
 */
namespace App\Http\Controllers\Realme;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApplicationController extends Controller
{

    /**
     * 应用管理首页
     * @return view
     */
    function index()
    {
        return view('realme.application.index');
    }

}
