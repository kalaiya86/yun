var G_DATAAJAX,G_DATAAJAX2,G_MAPAJAX,G_BARAJAX;
$(function () {
    //========================================
    //顶部基本指标部分
    //========================================
    initBasic();
    function initBasic() {
        var inter = $('.real-time.content-middle').eq(0).attr('data-inter');
        var url  = $('.real-time.content-middle').eq(0).attr('data-url');
        $.ajax({
            url: url,
            dataType: 'html',
            data: {'data-inter':inter},
            type: 'post',
            success: function (data) {
                try{
                    jQuery.parseJSON(data);
                    console.error(data);
                }catch(e){
                    $('.real-time.content-middle').eq(0).find('ul').empty().append(data);
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('基本指标：网络错误');
            }
        });
    }
    setInterval(initBasic,$('.real-time.content-middle').eq(0).attr('data-inter'))


    //========================================
    //折线图按钮样式
    //========================================
    function realTimeBtnChange(el) {
        $('.real-time-btn .gradient-border').removeClass('current');
        el.parent().addClass('current');
    }

    var lineChart,lineChartInterval; //定义两个折线图的对象
    //========================================
    //实时数据30秒折线图
    //========================================
    $('.real-time-btn .gradient-border button').eq(0).click(function () {
        var $that = $(this);
        var url = $(this).attr('data-url'),inter = $(this).attr('data-inter');

        if(G_DATAAJAX) G_DATAAJAX.abort();
        if(G_DATAAJAX2) G_DATAAJAX2.abort();
        clearInterval(lineChartInterval);

        G_DATAAJAX = $.ajax({
            url: url,
            dataType: 'json',
            data: {'data-inter':inter,'is_first':1},
            type: 'post',
            success: function (data) {
                var d = data;
                if(d.respCode=='000'){
                    //刷新更新时间
                    if($('.real-time').eq(1).find('.update-time').length<=0){
                        $('.real-time').eq(1).children('h3').append('<div class="update-time"></div>');
                    }
                    $('.real-time').eq(1).find('.update-time').html('数据更新于：'+data.date);

                    realTimeBtnChange($that);
                    genLineChart(url,inter,d.data)
                }else{
                    pop(d.respDesc)
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('30秒实时数据：网络错误');
            }
        })
    }).trigger('click');

    //30秒折线图生成
    function genLineChart(url,inter,data) {

        if(lineChart!=undefined) lineChart.dispose();
        lineChart = echarts.init(document.getElementById('real-time-chart'));

        var xAxisLabel = [],lineValue = [],maxTime;
        for(var i in data){
            xAxisLabel.push(data[i].x)
            lineValue.push(Number(data[i].y))
        }
        maxTime = xAxisLabel[xAxisLabel.length-1];

        var optionLine = {
            title: {
                show: false
            },
            color:echartsDefaultColor,
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var html = '交易量:'+formatCurrency(String(params[0].value).formatNum(2))+'元<br />'+params[0].name
                    return html
                },
                backgroundColor:'rgba(102,192,255,1)'
                //formatter:'{a}:{c}'+CHARTUNIT.lineChart1.unit+'<br />{b}'
            },
            legend: {
                data:['data'],
                bottom:0,
                textStyle:{
                    color:'#cccccc'
                }
            },
            grid: {
                borderColor:'#FFF',
                containLabel: true,
                left:'30',
                right:'30',
                top:'10%'
            },
            toolbox: {
                show:false
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine:{
                    lineStyle:{
                        color:'#ccc'
                    }
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    showMinLabel:false,
                    showMaxLabel:false,
                    textStyle:{
                        color:'#93a0bf',
                    }
                },
                splitLine: {
                    lineStyle:{
                        type:'dashed',
                        color:'#ccc'
                    }
                },
                data: $.map(xAxisLabel,function (i) {
                    return moment(i).format('HH:mm:ss');
                }),
                z:99
            },
            yAxis: {
                type : 'value',
                name:CHARTUNIT.lineChart1.yAxisName,
                nameLocation:'middle',
                nameTextStyle:{
                    color:'#93a0bf'
                },
                offset:-5,
                splitLine: {
                    lineStyle:{
                        type:'dashed',
                        color:'#ccc'
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
                        color:'#93a0bf',
                        baseline:'bottom'
                    }
                },
                z:99
            },
            series: [
                {
                    name:CHARTUNIT.lineChart1.unitName,
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    symbolSize:6,
                    itemStyle:{
                        normal:{
                            opacity:0
                        },
                        emphasis:{
                            opacity:1,
                            borderWidth:2,
                            borderColor:'#FFF',
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        }
                    },
                    lineStyle:{
                      normal:{
                          width:0
                      }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0.5,
                                color: 'rgba(94,178,251,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(94,178,251,0)'
                            }])
                        }
                    },
                    data:lineValue
                }
            ]
        }
        lineChart.setOption(optionLine);

        lineChartInterval = setInterval(function () {

            if(G_DATAAJAX) G_DATAAJAX.abort();
            maxTime = parseInt(maxTime)+parseInt(inter);
            G_DATAAJAX = $.ajax({
                url: url,
                dataType: 'json',
                data: {'data-inter':inter},
                type: 'post',
                success: function (data) {
                    //console.log(moment(maxTime).format('HH:mm:ss')+'==='+data.data[0].y);
                    //刷新更新时间
                    if($('.real-time').eq(1).find('.update-time').length<=0){
                        $('.real-time').eq(1).children('h3').append('<div class="update-time"></div>');
                    }
                    $('.real-time').eq(1).find('.update-time').html('数据更新于：'+data.date);

                    xAxisLabel.push(maxTime)
                    lineValue.push(Number(data.data[0].y))
                    xAxisLabel.shift();
                    lineValue.shift();

                    lineChart.setOption({
                        xAxis: {
                            data: $.map(xAxisLabel,function (i) {
                                return moment(i).format('HH:mm:ss');
                            })
                        },
                        series: [{
                            type:'line',
                            name:CHARTUNIT.lineChart1.unitName,
                            data: lineValue
                        }]
                    });
                },
                error: function (re) {
                    if(re.status==200) location.href = '/';
                    //console.error('实时图数据未获取===='+moment(maxTime).format('HH:mm:ss')+'==='+0)
                    xAxisLabel.push(maxTime)
                    lineValue.push(0)
                    xAxisLabel.shift();
                    lineValue.shift();

                    lineChart.setOption({
                        xAxis: {
                            data: $.map(xAxisLabel,function (i) {
                                return moment(i).format('HH:mm:ss');
                            })
                        },
                        series: [{
                            type:'line',
                            name:CHARTUNIT.lineChart1.unitName,
                            data: lineValue
                        }]
                    });
                }
            })
        },inter)
    }




    //========================================
    //1小时折线图
    //========================================
    $('.real-time-btn .gradient-border button').eq(1).click(function () {
        var url = $(this).attr('data-url'),inter = $(this).attr('data-inter');
        var $that = $(this);

        if(G_DATAAJAX) G_DATAAJAX.abort();
        if(G_DATAAJAX2) G_DATAAJAX2.abort();
        clearInterval(lineChartInterval);

        G_DATAAJAX2 = $.ajax({
            url: url,
            dataType: 'json',
            data: {'data-inter':inter,'is_first':1},
            type: 'post',
            success: function (data) {
                var d = data;
                if(d.respCode=='000'){
                    //刷新更新时间
                    if($('.real-time').eq(1).find('.update-time').length<=0){
                        $('.real-time').eq(1).children('h3').append('<div class="update-time"></div>')
                    }
                    $('.real-time').eq(1).find('.update-time').html('数据更新于：'+data.date);

                    realTimeBtnChange($that);
                    genLineChart2(url,inter,d.data)
                }else{
                    pop(d.respDesc)
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('1小时折线图：网络错误');
            }
        })
    })

    function genLineChart2(url,inter,data) {

        if(lineChart!=undefined) lineChart.dispose();
        lineChart = echarts.init(document.getElementById('real-time-chart'));

        var xAxisLabel = [],lineValue = [],maxTime;
        for(var i in data){
            xAxisLabel.push(data[i].ACCT_TAMP)
            lineValue.push(data[i].TRANS_AMT)
        }
        maxTime = xAxisLabel[xAxisLabel.length-1];

        var optionLine2 = {
            tooltip: {
                trigger: 'axis',
                // formatter:'{a}:{c}'+CHARTUNIT.lineChart2.it+'<br />{b}'
                formatter:function(params,ticket,callback){
                    var html = '交易量:'+formatCurrency(String(params[0].value).formatNum(2))+'元<br />'+params[0].name
                    return html
                },
                backgroundColor:'rgba(232,115,37,1)'
            },
            title: {
                show:false
            },
            grid: {
                borderColor:'#ccc',
                containLabel: true,
                left:'30',
                right:'30',
                top:'10%'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine:{
                    lineStyle:{
                        color:'#ccc'
                    }
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    showMinLabel:false,
                    showMaxLabel:false,
                    textStyle:{
                        color:'#93a0bf',
                    }
                },
                data: $.map(xAxisLabel,function (i) {
                    return moment(i).format('YYYY-MM-DD HH:mm:ss');
                }),
                z:99
            },
            yAxis: {
                type: 'value',
                name:CHARTUNIT.lineChart2.yAxisName,
                nameLocation:'middle',
                nameTextStyle:{
                    color:'#93a0bf'
                },
                offset:-5,
                splitLine: {
                    lineStyle:{
                        type:'dashed',
                        color:'#ccc'
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
                        color:'#93a0bf',
                        baseline:'bottom'
                    }
                },
                z:99
            },
            dataZoom: [{
                type: 'inside',
                start: 87,
                end: 100
            }, {
                start: 87,
                end: 100,
                // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '90%',
                borderColor:'#ccc',
                handleStyle: {
                    color: '#CCC',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#93a0bf'
                },
                left:10,
                right:10
            }],
            series: [
                {
                    name:CHARTUNIT.lineChart2.unitName,
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    symbolSize:6,
                    itemStyle:{
                        normal:{
                            opacity:0
                        },
                        emphasis:{
                            opacity:1,
                            borderWidth:2,
                            borderColor:'#FFF',
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        }
                    },
                    lineStyle:{
                        normal:{
                            width:0
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },
                    data: lineValue
                }
            ]
        };

        lineChart.setOption(optionLine2);

        lineChartInterval = setInterval(function () {
            if(G_DATAAJAX2) G_DATAAJAX2.abort();
            maxTime = parseInt(maxTime)+parseInt(inter);

            G_DATAAJAX2 = $.ajax({
                url: url,
                dataType: 'json',
                data: {'data-inter':inter},
                type: 'post',
                success: function (data) {
                    //刷新更新时间
                    if($('.real-time').eq(1).find('.update-time').length<=0){
                        $('.real-time').eq(1).children('h3').append('<div class="update-time"></div>');
                    }
                    $('.real-time').eq(1).find('.update-time').html('数据更新于：'+data.date);

                    xAxisLabel.push(maxTime)
                    lineValue.push(data.data[0].TRANS_AMT)
                    xAxisLabel.shift();
                    lineValue.shift();
                    lineChart.setOption({
                        xAxis: {
                            data: $.map(xAxisLabel,function (i) {
                                return moment(i).format('YYYY-MM-DD HH:mm:ss');
                            })
                        },
                        series: [{
                            type:'line',
                            name:CHARTUNIT.lineChart1.unitName,
                            data: lineValue
                        }]
                    });
                },
                error: function (re) {
                    if(re.status==200) location.href = '/';
                    console.error('1小时折线图：网络错误');
                }
            })
        },inter)
    }



    //========================================
    //地域分布实时图
    //========================================
    var mapInterval,mapChart;
    mapChart = echarts.init(document.getElementById('map2'));

    $('.real-time-map>h3').eq(0).click(function () {
        if(!$(this).hasClass('current')){
            $(this).addClass('current').siblings().removeClass('current');
            $('.map2-wrap').show();
            $('.map1-wrap').hide();
        }

        var inter = $(this).attr('data-inter');
        var url = $(this).attr('data-url');

        if(G_MAPAJAX!=undefined) G_MAPAJAX.abort();
        G_MAPAJAX = $.ajax({
            url: url,
            dataType: 'json',
            //data: {'data-inter':inter,'is_first':1},
            type: 'post',
            success: function (data) {
                var d = data;
                //d = {"respCode":"000","data":[{"geoCoord":["125.929024","41.720909"],"name":"\u901a\u5316","value":"10.0"},{"geoCoord":["120.749222","30.757999"],"name":"\u5609\u5174","value":"10000.0"},{"geoCoord":["114.279121","30.572399"],"name":"\u6b66\u6c49","value":"105000.0"},"",{"geoCoord":["120.165024","30.252501"],"name":"\u676d\u5dde","value":"63126.43"},"","",{"geoCoord":["116.3974589","39.9388838"],"name":"\u5317\u4eac","value":"111748.0"},"",{"geoCoord":["114.0538788","22.5551603"],"name":"\u6df1\u5733","value":"2597.0"},{"geoCoord":["121.4767528","31.224349"],"name":"\u4e0a\u6d77","value":"10000.0"},{"geoCoord":["113.110611","23.035509"],"name":"\u4f5b\u5c71","value":"10000.0"},"",{"geoCoord":["119.303223","26.070999"],"name":"\u798f\u5dde","value":"1950.0"},{"geoCoord":["113.653023","34.762501"],"name":"\u90d1\u5dde","value":"100.0"},{"geoCoord":["126.769508","43.617748"],"name":"\u5409\u6797\u5e02","value":"550.0"},"",{"geoCoord":["113.805321","34.022511"],"name":"\u8bb8\u660c","value":"4000.0"},{"geoCoord":["108.323418","22.823021"],"name":"\u5357\u5b81","value":"22000.0"},{"geoCoord":["113.2278442","23.1255978"],"name":"\u5e7f\u5dde","value":"1000.0"},{"geoCoord":["117.275620","31.861410"],"name":"\u5408\u80a5","value":"10.0"},{"geoCoord":["106.5485537","29.5549126"],"name":"\u91cd\u5e86","value":"10000.0"},{"geoCoord":["118.335617","35.057011"],"name":"\u4e34\u6c82","value":"100.0"},{"geoCoord":["114.488930","38.049210"],"name":"\u77f3\u5bb6\u5e84","value":"500.0"},{"geoCoord":["119.947220","31.766211"],"name":"\u5e38\u5dde","value":"100000.0"}],"date":"2017-07-06 10:31:53","respDesc":"success"}
                if(d.respCode=='000'){
                    genMapChart1(url,inter,d.data)
                }else{
                    pop(d.respDesc);
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('地域分布实时图：网络错误');
            }
        })
    }).trigger('click')


    //zhenglingfei
    function genMapChart1(url,inter,data) {
        clearInterval(mapInterval);

        //if(mapChart!=undefined) mapChart.dispose();
        //mapChart = echarts.init(document.getElementById('map2'));

        mapInterval = setInterval(function () {
            var inter = $('.real-time-map>h3').eq(0).attr('data-inter');
            var url = $('.real-time-map>h3').eq(0).attr('data-url');

            //if(G_MAPAJAX!=undefined) G_MAPAJAX.abort();
            G_MAPAJAX = $.ajax({
                url: url,
                dataType: 'json',
                // data: {'data-inter':inter,'is_first':1},
                type: 'post',
                success: function (data) {
                    var d = data;
                    if(d.respCode=='000'){
                        //刷新更新时间
                        if($('.real-time-map').find('.update-time').length<=0){
                            $('.real-time-map').prepend('<div class="update-time"></div>');
                        }
                        $('.real-time-map').find('.update-time').html('数据更新于：'+data.date);

                        genMapChart1(url,inter,d.data)
                    }else{
                        //alert(d.respDesc)
                    }
                },
                error: function (re) {
                    if(re.status==200) location.href = '/';
                }
            })
        },$('.real-time-map>h3').eq(0).attr('data-inter'))

        var mapObj1 = [];
        for(var i in data){
            if(data[i]!==''){
                mapObj1[i]={};
                mapObj1[i].name = data[i].name;
                mapObj1[i].value = [];
                mapObj1[i].value[0] = parseFloat(data[i].geoCoord[0]);
                mapObj1[i].value[1] = parseFloat(data[i].geoCoord[1]);
                mapObj1[i].value[2] = parseFloat(data[i].value);
            }
        }

        /*var dataX = [[116, 36, 1.5],[114, 27, 40],[113,34,14],[112,43,99]];
        for(var k in dataX){
            dataX[k][2] = Math.random()*100;
        }*/

        var optionMap1 = {
            backgroundColor: '#FFF',
            title: {
                show: false
            },
            tooltip : {
                trigger: 'item',
                formatter:  function (params, ticket, callback) {
                    var html = params.name+'<br/>交易量:'+formatCurrency(params.value[2])+'元'
                    return html
                },
                backgroundColor:'rgba(0,0,0,0.3)'
            },
            /*legend: {
                orient: 'vertical',
                y: 'bottom',
                x:'right',
                data:['充值交易量'],
                textStyle: {
                    color: '#fff'
                }
            },*/
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                scaleLimit:{
                    min:1,
                    max:3
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: "#999"
                            }
                        },
                        color: '#f4e925',
                        //shadowBlur: 1,
                        shadowColor: '#333',
                        borderColor:'#FFF',
                        areaColor: '#ededed',
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            show: true,
                            textStyle: {
                                color: "#999"
                            }
                        },
                        borderColor:'#FFF',
                        areaColor: '#9ed1fd'
                    }
                }
            },
            series : [
                {
                    name: '充值交易量',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: mapObj1,
                    symbolSize: function (val) {
                        if(val) {
                            var size = val[2] / 1000;
                            if (val[2] / 1000 > 30) {
                                size = 30
                            }
                            if(size<5) size = 5;
                        }else{
                            size = 0
                        }
                        return size;

                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'fill',
                        period:3,
                        scale:3
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [{
                                    offset: 0, color: '#5eb2fb' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(94,178,251,0.4)' // 0% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowBlur: 0,
                            //shadowColor: '#4883FF'
                        }
                    }
                    // zlevel: 1
                }
            ]
        }

        mapChart.setOption(optionMap1);
    }


    //地域分布热力图
    var mapProvince = '', mapCity='', barChart, mapChart2, provinceSelect,timeCurrent, MAX_TIME=0;

    $('.real-time-map>h3').eq(1).click(function () {
        if(!$(this).hasClass('current')){
            $(this).addClass('current').siblings().removeClass('current');
            $('.map2-wrap').hide();
            $('.map1-wrap').show();
        }

        provinceSelect = $('#map-chart-wrap select').selectize({
            onFocus : function () {
                /*$('.selectize-dropdown-content').niceScroll({
                 cursorborder: "0",
                 cursorcolor: "#466592",
                 background: "#3c4364",
                 autohidemode: false
                 });*/
            },
        });

        var inter = $(this).attr('data-inter');
        var url = $(this).attr('data-url');

        initMapChart2(url,inter);
        initBarChart(url,mapProvince,mapCity);
    })

    function initMapChart2(url,inter,endTime) {
        var endTime = endTime||false;
        var postDate = endTime?{'time':endTime}:{}

        if(G_MAPAJAX!=undefined) G_MAPAJAX.abort();
        G_MAPAJAX = $.ajax({
            url: url,
            dataType: 'json',
            data: postDate,
            type: 'post',
            success: function (data) {
                //data = {"respCode":"000","data":[{"PROV_NAME":"\u5e7f\u4e1c","TRANS_AMT":"52352651.11"},{"PROV_NAME":"\u5317\u4eac","TRANS_AMT":"15792927.03"},{"PROV_NAME":"\u4e0a\u6d77","TRANS_AMT":"11536649.42"},{"PROV_NAME":"\u6e56\u5317","TRANS_AMT":"8883513.04"},{"PROV_NAME":"\u5409\u6797","TRANS_AMT":"8438538.89"},{"PROV_NAME":"\u6d59\u6c5f","TRANS_AMT":"8088518.98"},{"PROV_NAME":"\u5c71\u4e1c","TRANS_AMT":"6253852.19"},{"PROV_NAME":"\u798f\u5efa","TRANS_AMT":"5479657.66"},{"PROV_NAME":"\u5e7f\u897f","TRANS_AMT":"5358219.18"},{"PROV_NAME":"\u6c5f\u82cf","TRANS_AMT":"5220335.51"},{"PROV_NAME":"\u8fbd\u5b81","TRANS_AMT":"5084575.16"},{"PROV_NAME":"\u5b89\u5fbd","TRANS_AMT":"4012667.09"},{"PROV_NAME":"\u6cb3\u5317","TRANS_AMT":"2686775.75"},{"PROV_NAME":"\u91cd\u5e86","TRANS_AMT":"2317923.66"},{"PROV_NAME":"\u5185\u8499\u53e4","TRANS_AMT":"2010910.20"},{"PROV_NAME":"\u56db\u5ddd","TRANS_AMT":"1551225.71"},{"PROV_NAME":"\u6e56\u5357","TRANS_AMT":"1465526.45"},{"PROV_NAME":"\u9ed1\u9f99\u6c5f","TRANS_AMT":"1436409.69"},{"PROV_NAME":"\u6c5f\u897f","TRANS_AMT":"1208137.59"},{"PROV_NAME":"\u65b0\u7586","TRANS_AMT":"928275.62"},{"PROV_NAME":"\u6cb3\u5357","TRANS_AMT":"905714.05"},{"PROV_NAME":"\u5c71\u897f","TRANS_AMT":"713712.67"},{"PROV_NAME":"\u7518\u8083","TRANS_AMT":"529337.13"},{"PROV_NAME":"\u9655\u897f","TRANS_AMT":"501430.66"},{"PROV_NAME":"\u5929\u6d25","TRANS_AMT":"499053.87"},{"PROV_NAME":"\u8d35\u5dde","TRANS_AMT":"491412.07"},{"PROV_NAME":"\u4e91\u5357","TRANS_AMT":"131332.47"},{"PROV_NAME":"\u6d77\u5357","TRANS_AMT":"95070.23"},{"PROV_NAME":"\u9752\u6d77","TRANS_AMT":"21000.00"},{"PROV_NAME":"\u5b81\u590f","TRANS_AMT":"2020.00"},{"PROV_NAME":"\u897f\u85cf","TRANS_AMT":"540.00"}],"time":1499313000,"date":"2017-07-06 11:52:45","respDesc":"success"}

                if(data.respCode=='000'){
                    //刷新更新时间
                    if($('.real-time-map').find('.update-time').length<=0){
                        $('.real-time-map').prepend('<div class="update-time"></div>');
                    }
                    $('.real-time-map').find('.update-time').html('数据更新于：'+data.date);

                    if(MAX_TIME==0){ //如果没有初始化过时间轴
                        MAX_TIME = parseInt(data.time);
                        initTimeBar(MAX_TIME)//初始化时间轴
                    }
                    genMapChart2(url,data.data)
                }else{
                    pop(data.respDesc)
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('网络出错:地域分布热力图')
            }
        })

        function genMapChart2(url,data) {
            clearInterval(mapInterval); //清除热力图的interval

            if(mapChart2!=undefined) mapChart2.dispose();
            mapChart2 = echarts.init(document.getElementById('map1'));

            var mapObj2 = [];
            for(var i in data){
                mapObj2[i]={};
                mapObj2[i].name = data[i].PROV_NAME;
                mapObj2[i].value = [];
                mapObj2[i].value = data[i].TRANS_AMT;
            }

            var optionMap2 = {
                title: {
                    show:false
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(params,ticket,callback){
                        var amount;
                        if(params.value){
                            amount = formatCurrency(String(params.value).formatNum(2));
                        }else{
                            amount='--'
                        }
                        var html = params.name+'<br>交易量:'+amount+'元'
                        return html
                    },
                    backgroundColor:'rgba(0,0,0,0.3)'
                },
                selectedMode : 'single',
                visualMap: {
                    min: 100,
                    max: 10000000,
                    left: -300,
                    top: 'bottom',
                    color: ['rgba(235,91,158,0.9)', 'rgba(71,139,232,0.9)'],
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: true,
                    textStyle: {
                        color: "#93a0bf"
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: "#93a0bf"
                                    }
                                },
                                borderColor:'#FFF',
                                areaColor: '#ededed',
                                borderWidth: 1
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: "#93a0bf"
                                    }
                                },
                                borderColor:'#FFF',
                                areaColor: '#9ed1fd'
                            }
                        },
                        data:mapObj2
                    }
                ]
            };
            mapChart2.setOption(optionMap2);
            mapChart2.on('mapselectchanged', function (param) { //绑定地图选中事件
                var selectedProvince = '';
                var selectedNum = 0;
                for(var k in param.batch[0].selected){
                    if(param.batch[0].selected[k] == true){
                        selectedProvince = k;
                        selectedNum++;
                    }
                }
                if(selectedNum==0) selectedProvince = '';
                mapProvince = selectedProvince; //得到选中省份名称

                var selectInst = $('#map-chart-wrap select')[0].selectize;
                selectInst.setValue(mapProvince);


                initBarChart(url,mapProvince,mapCity,$('#pin-time').attr('time').substring(0,10))
            });
        } //genMapChart2

        initMapEvent();
    }

    function initBarChart(url,province,city,endTime) {
        var endTime = endTime||false;
        var postDate = endTime?{'province':province,'city':city,'time':endTime}:{'province':province,'city':city}
        if(G_BARAJAX!=undefined) G_BARAJAX.abort();
        G_BARAJAX = $.ajax({
            url: url,
            dataType: 'json',
            data: postDate,
            type: 'post',
            success: function (data) {
                //data = {"respCode":"000","data":[{"PROV_NAME":"\u5e7f\u4e1c","TRANS_AMT":"65313740.62"},{"PROV_NAME":"\u5317\u4eac","TRANS_AMT":"56372364.30"},{"PROV_NAME":"\u4e0a\u6d77","TRANS_AMT":"36676411.69"},{"PROV_NAME":"\u6c5f\u82cf","TRANS_AMT":"23411792.55"},{"PROV_NAME":"\u6d59\u6c5f","TRANS_AMT":"21882520.56"},{"PROV_NAME":"\u798f\u5efa","TRANS_AMT":"19390526.24"},{"PROV_NAME":"\u5c71\u4e1c","TRANS_AMT":"15271195.77"},{"PROV_NAME":"\u6e56\u5317","TRANS_AMT":"15244825.75"},{"PROV_NAME":"\u6cb3\u5317","TRANS_AMT":"10202124.54"},{"PROV_NAME":"\u5b89\u5fbd","TRANS_AMT":"9079468.10"},{"PROV_NAME":"\u5e7f\u897f","TRANS_AMT":"8388708.05"},{"PROV_NAME":"\u8fbd\u5b81","TRANS_AMT":"7457082.61"},{"PROV_NAME":"\u5c71\u897f","TRANS_AMT":"7405067.64"},{"PROV_NAME":"\u5409\u6797","TRANS_AMT":"5793638.96"},{"PROV_NAME":"\u6c5f\u897f","TRANS_AMT":"4126900.27"},{"PROV_NAME":"\u56db\u5ddd","TRANS_AMT":"3732792.12"},{"PROV_NAME":"\u6e56\u5357","TRANS_AMT":"3697349.91"},{"PROV_NAME":"\u5185\u8499\u53e4","TRANS_AMT":"3399469.02"},{"PROV_NAME":"\u6cb3\u5357","TRANS_AMT":"2970887.83"},{"PROV_NAME":"\u4e91\u5357","TRANS_AMT":"2960668.59"},{"PROV_NAME":"\u91cd\u5e86","TRANS_AMT":"2381596.36"},{"PROV_NAME":"\u8d35\u5dde","TRANS_AMT":"2347622.66"},{"PROV_NAME":"\u9655\u897f","TRANS_AMT":"2099396.56"},{"PROV_NAME":"\u65b0\u7586","TRANS_AMT":"2084432.85"},{"PROV_NAME":"\u5929\u6d25","TRANS_AMT":"1845638.45"},{"PROV_NAME":"\u9ed1\u9f99\u6c5f","TRANS_AMT":"1521526.35"},{"PROV_NAME":"\u7518\u8083","TRANS_AMT":"645573.45"},{"PROV_NAME":"\u6d77\u5357","TRANS_AMT":"351661.16"},{"PROV_NAME":"\u5b81\u590f","TRANS_AMT":"188898.85"},{"PROV_NAME":"\u9752\u6d77","TRANS_AMT":"34127.00"},{"PROV_NAME":"\u897f\u85cf","TRANS_AMT":"10000.00"}],"time":1499764200,"date":"2017-07-11 17:15:00","respDesc":"success"}

                if(data.respCode=='000'){
                    genBarChart(data.data)
                }else{
                    pop(data.respDesc)
                }
            },
            error: function (re) {
                if(re.status==200) location.href = '/';
                console.error('网络出错:柱状图')
            }
        })
        
        function genBarChart(data) {
            if(barChart!=undefined) barChart.dispose();
            barChart = echarts.init(document.getElementById('map-chart'));
            var xAxisLabel=[],yAxisLabel=[]; //柱状图的横竖坐标

            for(var i in data){
                var index = 0;
                for (var k in data[i]){
                    index++;
                    if(index==1){
                        yAxisLabel.push(data[i][k]);
                    }else{
                        xAxisLabel.push(data[i][k]);
                    }
                }
            }
            yAxisLabel = yAxisLabel.slice(0,12).reverse();
            xAxisLabel = xAxisLabel.slice(0,12).reverse();

            var optionBar={
                title: {
                    show:false
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor:'rgba(66,73,105,0.6)'
                },
                grid: {
                    left: '0%',
                    right: '10%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        show:false
                    },
                    splitNumber:4,
                    axisLine:{
                        lineStyle:{
                            color:'#93a0bf'
                        }
                    },
                    axisTick:{
                        show:false,
                        lineStyle:{
                            color:'#93a0bf'
                        }
                    },
                    axisLabel:{
                        showMinLabel:false,
                        showMaxLabel:false,
                        textStyle:{
                            color:'#93a0bf'
                        }
                    },
                    name:'充值交易量(元)',
                    nameLocation:'middle',
                    nameTextStyle:{
                        color:'#93a0bf'
                    },
                    nameGap:50
                },
                yAxis: {
                    type: 'category',
                    data: yAxisLabel.slice(0,12),
                    axisLabel:{
                        textStyle:{
                            color:'#93a0bf',
                            baseline:'middle'
                        }
                    },
                    boundaryGap:['20%','20%'],
                    splitLine: {
                        show:false
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#93a0bf'
                        }
                    },
                },
                series: [
                    {
                        name: '充值交易量',
                        type: 'bar',
                        data: xAxisLabel.slice(0,12),
                        barMaxWidth:8,
                        itemStyle: {
                            normal: {
                                barBorderRadius:[0,4,4,0],
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: 'rgb(188, 128, 234)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(47, 124, 220)'
                                }])
                            }
                        }
                    }
                ]
            }

            barChart.setOption(optionBar);

            /*barChart.on('click', function (param) { //绑定地图选中事件
                if(mapProvince==''){
                    mapProvince = param.name;
                }else{
                    mapCity = param.name;
                }

                initBarChart(url,mapProvince,mapCity)
            });*/
        }
    }

    function initMapEvent() {
        $('.selectized').unbind('change').change(function () {
            mapProvince = $(this).val();
            mapChart2.dispatchAction({
                type: 'mapSelect',
                name: mapProvince
            })
            initBarChart($('.real-time-map>h3').eq(1).attr('data-url'),mapProvince,mapCity)
        })
    }


    /*地图数据结束*/

    //时间拖拽
    function initTimeBar(endTime) {
        var timeBlockIndex = 0, longClass, innerDiv = '', endTime = endTime+'000', endTimer = (endTime + '').substr(0, 10), G_timer = endTimer, slideIndex;
        for (var timeOuter = 0; timeOuter < 24; timeOuter++) {
            for (var timeInner = 0; timeInner < 12; timeInner++) {
                timeBlockIndex++;
                if (getTime(endTime).substr(3, 2) == '00') {
                    longClass = ' timeline-long';
                } else {
                    longClass = ''
                }

                if (parseInt(getTime(endTime).substr(0, 2)) % 2 == 0 && getTime(endTime).substr(3, 2) == '00') {
                    innerDiv = '<span>' + getTime(endTime) + '</span>'
                } else {
                    innerDiv = ''
                }
                $('.timeline-wrap').prepend('<div class="timeline-inner' + longClass + '" data-time="' + getTime(endTime) + '" data-timer="' + (endTime + '').substr(0, 10) + '">' + innerDiv + '</div>');
                endTime = endTime - 300000;
            }
        }

        setInterval(updateTime, 300000);

        function updateTime() {
            for (var i = 0; i < 1; i++) {
                var that = $('.timeline-wrap .timeline-inner').eq(i), timer = that.data('timer') + 86400;
                var obj = that.attr('data-timer', timer).data('timer', timer).clone();
                that.remove()
                $('.timeline-wrap').append(obj);
                /*初始化maxtime*/
                endTimer = parseInt(endTimer) + 300;
                G_timer = endTimer;
                $('.chart-heatmap-header').data('timemax', parseInt(endTime) + 300).attr('data-timemax', parseInt(endTime) + 300);
                var pt = parseInt($('#pin-time').attr('time')) + 300,
                    val = $(".time-nipple").slider("value");
                $('#pin-time').text(getTime(pt*1000)).attr('time', pt);

                var inter = $('.real-time-map>h3').eq(1).attr('data-inter');
                var url = $('.real-time-map>h3').eq(1).attr('data-url');

                initMapChart2(url,inter,pt);
                initBarChart(url,mapProvince,mapCity,pt)
            }
        }

        $(".time-nipple").slider({
            range: "max",
            min: 1,
            max: 288,
            value: 288,
            step: 1,
            slide: function (event, ui) {
                var t = endTimer * 1000 - (288 - ui.value) * 300000;
                var t2 = endTimer  - (288 - ui.value) * 300;
                $('#pin-time').text(getTime(t)).attr('time', t2);
                slideIndex = ui.value;
            },
            stop: function (event, ui) {
                $('.location-province span').removeClass('current').eq(0).addClass('current');
                $('.select-wrap').text('全国');
                G_timer = parseInt(endTimer - (288 - ui.value) * 300);

                var inter = $('.real-time-map>h3').eq(1).attr('data-inter');
                var url = $('.real-time-map>h3').eq(1).attr('data-url');

                initMapChart2(url,inter,G_timer);
                initBarChart(url,mapProvince,mapCity,G_timer)
            }
        });

        $('#pin-time').text(getTime(endTime)).attr('time', endTimer)
    }



    function getTime(time) {
        var time = time;
        time = new Date(time).toTimeString();
        time = time.substring(0, 5);
        return time;
    }


    $(window).resize(function () {
        lineChart.resize();
        mapChart.resize();
        mapChart2.resize();
        barChart.resize();
    })
})















