var G_DATAAJAX,G_DATAAJAX2,G_DATAAJAX3;
$(function () {
    //表单查询
    $('#form01').on('submit',function (e) {
        e.preventDefault();
        var $container = $('.content-bottom');

        $container.children('.company-name,.table-wrap,.company-radar-map').hide();
        $container.children('.company-name').html('<div class="data-loading">数据加载中....</div>');

        if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
        G_DATAAJAX = $.ajax({
            url: $(this).attr('action'),
            dataType: 'json',
            data: $(this).serialize(),
            type: 'post',
            success: function (data) {

            },
            error: function () {
                pop('网络出错');
            }
        })

        if(G_DATAAJAX2!=undefined) G_DATAAJAX2.abort();
        G_DATAAJAX2 = $.ajax({
            url: $('form02').attr('action'),
            dataType: 'json',
            data: $('form02').serialize(),
            type: 'post',
            success: function (data) {

            },
            error: function () {
                pop('网络出错');
            }
        })

        if(G_DATAAJAX3!=undefined) G_DATAAJAX3.abort();
        G_DATAAJAX3 = $.ajax({
            url: $('form03').attr('action'),
            dataType: 'json',
            data: $('form03').serialize(),
            type: 'post',
            success: function (data) {

            },
            error: function () {
                pop('网络出错');
            }
        })
    })

    /*雷达图初始化*/
    radarChart.setOption(optionRadar);

    /*折现图初始化*/
    var lineChart = echarts.init(document.getElementById('company-line-map'));
    var optionLine = {
        title: {
            show: false
        },
        color:echartsDefaultColor,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['data1','data2','data3'],
            bottom:0,
            textStyle:{
                color:'#cccccc'
            }
        },
        grid: {
            borderColor:'#434655',
            containLabel: true,
            left:'0%',
            right:'0%',
            top:'5%'
        },
        toolbox: {
            show:false
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine:{
                lineStyle:{
                    color:'#5a5a71'
                }
            },
            axisTick:{
                show:false
            },
            axisLabel:{
                showMinLabel:false,
                showMaxLabel:false,
                textStyle:{
                    color:'#999999',
                }
            },
            data: ['周一','周二','周三','周四','周五','周六','周日'],
        },
        yAxis: {
            type : 'value',
            splitLine: {
                lineStyle:{
                    type:'dashed',
                    color:'#5a5a71'
                }
            },
            axisLine:{
                show:false
            },
            axisTick:{
                show:false
            },
            axisLabel:{
                inside:true,
                textStyle:{
                    color:'#999999',
                    baseline:'bottom'
                }
            }
        },
        series: [
            {
                name:'data',
                type:'line',
                smooth:true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ff682b'
                        }, {
                            offset: 1,
                            color: 'rgba(255,104,43,0)'
                        }])
                    }
                },
                data:[322, 132, 423, 134, 555, 123, 310]
            }
        ]
    }

    lineChart.setOption(optionLine);

    $(window).resize(function () {
        radarChart.resize();
        lineChart.resize();
    })


})