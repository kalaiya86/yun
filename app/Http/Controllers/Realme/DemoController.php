<?php
/**
 * 在线试用
 * @author kelly.wang
 * @date 2017.8.23
 */
namespace App\Http\Controllers\Realme;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;


class DemoController extends Controller
{
    /**
     * 在线试用首页
     * @return view
     */
    function index()
    {
        return view('realme.demo.index');
    }
}
