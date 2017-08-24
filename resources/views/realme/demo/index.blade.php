@extends('layouts.realme')
@section('title', '在线试用')


@section('content')
    <div class="content-header realme-index">
            <div class="realme-header">
                <div class="realme-header-title"></div>
                <div class="realme-header-content">
                    <p>已建应用: <span>10</span>个</p>
                    <p>汇付云已为你创建了1个免费应用</p>
                </div>
                <div class="matrix component-btn">
                    <div class="gradient-border">
                        <button type="submit">立即查看</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-bottom realme-index">
            <div class="table-wrap" style="overflow: hidden;" tabindex="0">
                <h3 style="display: block;">用量监控</h3>
                <table class="matrix component-table">
                    <thead>
                    <tr>
                        <th style="width: 45%">API</th>
                        <th style="width: 25%">当前调用次数</th>
                        <th style="width: 20%">免费调用次数</th>
                        <th style="width: 10%">在线试用</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="">人像照片公安认证</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""><a href="javascript:void(0);">立即体验</a></td>
                    </tr>
                    <tr>
                        <td class="">人像活体公安认证</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""></td>
                    </tr>
                    <tr>
                        <td class="">银行卡验证</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""><a href="javascript:void(0);">立即体验</a></td>
                    </tr>
                    <tr>
                        <td class="">手机号认证</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""></td>
                    </tr>
                    <tr>
                        <td class="">实名认证（姓名、身份证号认证）</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""></td>
                    </tr>
                    <tr>
                        <td class="">身份证照片验证</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""></td>
                    </tr>
                    <tr>
                        <td class="">人像比对</td>
                        <td class="">0</td>
                        <td class="">50</td>
                        <td class=""></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="content-bottom">
            <div class="table-wrap" style="overflow: hidden;" tabindex="0">
                <h3 style="display: block;">产品服务列表及定价</h3>
                <table class="matrix component-table">
                    <thead>
                    <tr>
                        <th style="width: 35%">API</th>
                        <th style="width: 15%">状态</th>
                        <th style="width: 25%">定价</th>
                        <th style="width: 25%">功能描述</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="">人像照片公安认证</td>
                        <td class="">付费使用</td>
                        <td class="">1.5元/次</td>
                        <td class="">验证人像、姓名、身份证号与公安系统数据是否一致</td>
                    </tr>
                    <tr>
                        <td class="">人像活体公安认证</td>
                        <td class="">付费使用</td>
                        <td class="">1.5元/次</td>
                        <td class="">先获取客户实时视频环节高清人像，再验证人像、姓...</td>
                    </tr>
                    <tr>
                        <td class="">银行卡验证</td>
                        <td class="">付费使用</td>
                        <td class="">0.5元/次</td>
                        <td class="">验证银行2、3、4要素与银行数据一致性</td>
                    </tr>
                    <tr>
                        <td class="">手机号认证</td>
                        <td class="">付费使用</td>
                        <td class="">移动：0.6元/次  联通：0.4元/次  电信：0.3元/次</td>
                        <td class="">验证姓名、身份证号、手机号与运营商系统数据一致性</td>
                    </tr>
                    <tr>
                        <td class="">实名认证（姓名、身份证号认证）</td>
                        <td class="">付费使用</td>
                        <td class="">1.5元/次</td>
                        <td class="">验证姓名、身份证号与公安系统数据是否一致</td>
                    </tr>
                    <tr>
                        <td class="">身份证照片验证</td>
                        <td class="">付费使用</td>
                        <td class="">2.0元/次</td>
                        <td class="">验证身份证正反面与公安系统数据是否一致</td>
                    </tr>
                    <tr>
                        <td class="">人像比对</td>
                        <td class="">付费使用</td>
                        <td class="">0.2元/次</td>
                        <td class="">比对两张照片是否为同一人</td>
                    </tr>
                    <tr>
                        <td class="">身份证、银行卡图像识别服务</td>
                        <td class="">免费使用</td>
                        <td class="">0元/次</td>
                        <td class="">识别提取出实体银行卡或身份证中的信息</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
@endsection
        
