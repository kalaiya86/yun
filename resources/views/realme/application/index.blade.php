@extends('layouts.realme')
@section('title', '试用中心')


@section('content')
        <div class="content-header realme-myapp cf">
            <h2>应用列表</h2>
            <div class="matrix component-btn">
                <div class="gradient-border">
                    <button type="submit">API文档</button>
                </div>
                <div class="gradient-border">
                    <button type="submit">SDK下载</button>
                </div>
            </div>
        </div>

        <div class="content-bottom realme-myapp">
            <div class="table-wrap" style="overflow: hidden;" tabindex="0">
                <table class="matrix component-table">
                    <thead>
                    <tr>
                        <th style="width: 45%">应用列表</th>
                        <th style="width: 25%">app_token</th>
                        <th style="width: 20%">aap_key</th>
                        <th style="width: 10%">创建时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="">应用名称1</td>
                        <td class="">TESTRA000432</td>
                        <td class="">*******</td>
                        <td class="">2017-07-29</td>
                    </tr>
                    <tr>
                        <td class="">应用名称2</td>
                        <td class="">TESTRA000432</td>
                        <td class="">*******</td>
                        <td class="">2017-07-29</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
@endsection