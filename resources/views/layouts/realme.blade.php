<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AskMe 风控信息平台 - @yield('title')</title>
    <link rel="stylesheet" href="{{ asset('styles/index.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/selectize.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/daterangepicker.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/jquery.pagination.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/jquery-ui.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/dialog.css') }}">
    <link rel="stylesheet" href="{{ asset('styles/realme.css') }}">

    <script src="{{ asset('js/vendor/jquery.min.js') }}"></script>
    <script src="{{ asset('js/vendor/moment.js') }}"></script>
    <script src="{{ asset('js/vendor/selectize.min.js') }}"></script>
    <script src="{{ asset('js/vendor/jquery.daterangepicker.min.js') }}"></script>
    <script src="{{ asset('js/vendor/jquery.pagination.js') }}"></script>
    <script src="{{ asset('js/vendor/dialog.js') }}"></script>
    <script src="{{ asset('js/vendor/jquery.nicescroll.min.js') }}"></script>
    <script src="{{ asset('js/vendor/jquery.transit.min.js') }}"></script>
    <script src="{{ asset('js/index.js') }}"></script>
</head>
<body>
<div class="wrap">
    @section('sidebar')
        <div class="top-bar">
            <div class="logo">@yield('title')</div>
            <div class="user-info">

                <u class="user-img" style="display: none">
                    <img src="https://cloud.chinapnr.com/askme/imgs/user-pic.png" alt="" width="32" height="32">-->
                    <a class="theme " href="javascript:void(0);">设置</a>
                </u>
                <a href="javascript:void(0);" class="user-name">test@chinapnr.com</a> &nbsp;
                <a href="https://cloud.chinapnr.com/askme/login/logout" class="exit">退出</a>
            </div>
        </div>
        <button type="button" class="btn-menu" onclick=""><!--主菜单--></button>

        <ul class="menu"> <!--主菜单图表及提示-->
            <li><!--<span>控台总览</span>--></li>
            <li><!--<span>产品服务</span>--></li>
            <li><!--<span>应用管理</span>--></li>
            <li><!--<span>财务中心</span>--></li>
            
            @foreach ($menu as $li)
                @if ($loop->index==$current)
                <li class="current">
                @else   
                <li>
                @endif
                <!--<span>{{ $li['title'] }}</span>--></li>
            @endforeach
        </ul>
        

        <ul class="sub-menu"> <!--子菜单,数量和主菜单一一对应-->
        @foreach ($menu as $li)
            @if ($loop->index==$current)
            <li class="current">
            @else   
            <li>
            @endif
                <dl>
                    <dt>控台总览</dt>
                    <dd><div class="gradient-border "><a href="/">控台总览1</a></div></dd>
                </dl>
            </li>
        @endforeach

            <li>
                <dl>
                    <dt>控台总览</dt>
                    <dd><div class="gradient-border "><a href="/">控台总览1</a></div></dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>产品服务</dt>
                    <dd><div class="gradient-border "><a href="javascript:void(0);">聚合鉴权</a></div></dd>
                    <dd><div class="gradient-border "><a href="javascript:void(0);">API文档</a></div></dd>
                    <dd><div class="gradient-border "><a href="javascript:void(0);">SDK下载</a></div></dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>应用管理</dt>
                    <dd><div class="gradient-border "><a href="javascript:void(0);">应用管理1</a></div></dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>财务中心</dt>
                    <dd><div class="gradient-border "><a href="javascript:void(0);">财务中心1</a></div></dd>
                </dl>
            </li>
        </ul>
    @show
    <div id="realme" class="content-wrap" style="text-align: center">
        @yield('content')
    </div>
</div>
</body>
</html>