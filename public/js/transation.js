var G_DATAAJAX,G_DATAAJAX2,G_DATAAJAX3,d;
$(function () {
    $('.component-datepicker').each(function () {
        var t = $(this).find('input[type="hidden"]').eq(0).val()+'至'+$(this).find('input[type="hidden"]').eq(1).val();
        $(this).find('.gradient-border input').val(t);
    })

    $('.content-bottom').on('click','.info-detail',function (e) {
        e.preventDefault();
        initPop('数据加载中,请稍候...',22,'dialog-error');

        if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
        G_DATAAJAX = $.ajax({
            url: $(this).attr('href'),
            dataType: 'html',
            //data: $(this).serialize(),
            type: 'post',
            success: function (data) {
                try{
                    jQuery.parseJSON(data);
                    d.remove();
                    initPop('数据加载出错,请稍候再试!',22,'dialog-error');
                }catch(e){
                    d.remove();
                    initPop(data,$(window).height()-200); //初始化弹出框

                    if($('.pop-pager').length>0){ //如果存在分页
                        initPagerPop($('.pop-pager').attr('page-total'),$('.pop-pager').attr('page-size'),$('.pop-content-wrap'),$('.pop-pager'))
                    }

                    $('.pop-detail,.pop-history').niceScroll({
                        cursorborder: "0",
                        cursorcolor: "#c0d6f3",
                        background: "#ececec"
                    });
                }
            },
            error: function () {
                d.remove();
                initPop('数据加载出错,请稍候再试!',22,'dialog-error');
            }
        })
    })

    //表单查询
    $('#form01').on('submit',function (e) {
        e.preventDefault();
        //判断是否
        if(!checkHasValue($('#form01'))){
            pop('请至少输入一个查询条件！')
            return;
        };

        //判断必填
        var requiredEle = 0;
        $('.required').each(function () {
            if($.trim($(this).find('input:visible').val())==''){
                requiredEle++;
                pop('请输入查询日期！')
            }
        })

        //判断日期格式
        var validDate = 0;
        $('.component-datepicker').each(function () {
            var startDate = $(this).find('input:visible').val().split('至')[0];
            var endDate = $(this).find('input:visible').val().split('至')[1];
            $(this).find('input[type="hidden"]').eq(0).val(startDate);
            $(this).find('input[type="hidden"]').eq(1).val(endDate);

            if(!moment(startDate).isValid() || !moment(endDate).isValid()) validDate++;
        })

        if(requiredEle>0) return;

        if(validDate>0){
            pop('请输入正确日期格式！')
            return;
        };

        if($('.component-datepicker').length>0){
            if(DateDiff($('.component-datepicker').find('input:visible').val().split('至')[0],$('.component-datepicker').find('input:visible').val().split('至')[1])>31){
                pop('日期间隔不可大于31天！')
                return;
            };
        }

        if($('.company-radar-info').length>0){
                //评级页面的操作
                var $container = $('.company-radar-info');

                $container.html('<div class="data-loading">数据加载中....</div>');

                if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
                G_DATAAJAX = $.ajax({
                    url: $(this).attr('action'),
                    dataType: 'html',
                    data: $(this).serialize(),
                    type: 'post',
                    success: function (data) {
                        try{
                            if(data==''){
                                $container.html('<div class="data-loading no-data"></div>');
                            }else{
                                jQuery.parseJSON(data);
                                //d.remove();
                                //initPop('数据加载出错,请稍候再试!',22);
                                $container.html('<div class="data-loading no-data server-wrong"></div>');
                                console.error(jQuery.parseJSON(data));
                            }
                        }catch(e){
                            var d = data;
                            $container.html(data);
                        }

                    },
                    error: function () {
                        $container.html('<div class="data-loading no-data server-wrong"></div>');
                        console.error('网络出错:查询按钮请求出错');
                    }
                })
        }else{
                //非评级页面的操作
                var $container = $('.content-bottom');

                $('.table-pager').hide();
                $container.children('h3').hide();
                $container.children('.table-wrap').html('<div class="data-loading">数据加载中....</div>');

                if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
                G_DATAAJAX = $.ajax({
                    url: $(this).attr('action'),
                    dataType: 'json',
                    data: $(this).serialize(),
                    type: 'post',
                    success: function (data) {
                        var d = data;
                        if(d.respCode=='000'){
                            if(d.data.length==0){
                                $container.children('.table-wrap').html('<div class="data-loading no-data" ></div>');
                            }else{
                                $container.children('h3').show();
                                $container.children('.table-wrap').html(generateTable(d.header,d.data,d.class)).show();
                                $('.table-wrap').niceScroll({
                                    cursorborder: "0",
                                    cursorcolor: "#c0d6f3",
                                    background: "#ececec",
                                    autohidemode: false
                                });

                                initPager(d.count,d.pageSize,$('.table-pager'),$('#form01'),$('.table-wrap'))
                            }
                        }else{
                            $container.html('<div class="data-loading no-data server-wrong"></div>');
                            //pop(d.respMsg)
                        }
                    },
                    error: function () {
                        $container.html('<div class="data-loading no-data server-wrong"></div>');
                        console.error('网络出错:查询按钮请求出错');
                    }
                })
        }


        //如果有form02
        if($('#form02').length>0){
            (function () {
                if(G_DATAAJAX2!=undefined) G_DATAAJAX2.abort();
                var paramObj = {};
                var $tempForm = $('#form01').clone(true);
                $tempForm.find('input[name="id"]').val($('#form02 input[name="id"]').val());

                if($('.company-radar-info').length>0){
                    $('.company-radar-map,.company-line-map').hide(); //先隐藏图表

                    G_DATAAJAX2 = $.ajax({
                        url: $('#form02').attr('action'),
                        dataType: 'json',
                        data: /*$.param(paramObj) + '&'+*/$tempForm.serialize(),
                        type: 'post',
                        success: function (data) {
                            var htmlRadar = '',htmlRadarInfo = '';
                            if(data.respCode=='000'&&data.data.length>0){
                                var index = 0;
                                var radaAxis = [
                                    {text: '', max: 3,min: -3},
                                    {text: '', max: 3,min: -3},
                                    {text: '', max: 3,min: -3},
                                    {text: '', max: 3,min: -3}
                                ],radaData = [];
                                var _moneyData = ["TOTAL_BID_AMT","TOTAL_LEND_AMT","LIMIT_VALUE"]
                                for(var i in data.data[0]){
                                    index++;
                                    if(index<=4){
                                        //htmlRadar += radarValue[i] + ':' + data.data[0][i];
                                        var radaDataValue = (data.data[0][i]==null)?0:data.data[0][i]
                                        radaAxis[index-1].text = radarValue[i];
                                        radaData.push(radaDataValue);
                                    }else{
                                        var htmlRadarInfoValue = (data.data[0][i]==null)?'--':data.data[0][i]
                                        var _data = "";

                                        for(var u=0;u<_moneyData.length;u++){
                                            if(_moneyData[u]==i){
                                                _data = htmlRadarInfoValue.formatNum(2);
                                                _data = formatCurrency(_data);
                                            }
                                            if(_data == ""){
                                                _data = htmlRadarInfoValue;
                                            }
                                        }
                                        htmlRadarInfo += '<li>'+radarValue[i] + ':<span>' + _data+'</span></li>';
                                    }
                                }

                                initRadar(radaAxis,radaData)

                                //$('#radar-wrap').html(htmlRadar);
                                $('.radar-info').html(htmlRadarInfo);
                            }else{
                                console.error('网络出错:评级雷达数据');
                            }
                        },
                        error: function () {
                            console.error('网络出错:Form02');
                        }
                    })
                }else{
                    G_DATAAJAX2 = $.ajax({
                        url: $('#form02').attr('action'),
                        dataType: 'html',
                        data: /*$.param(paramObj) + '&'+*/$tempForm.serialize(),
                        type: 'post',
                        success: function (data) {
                            try{
                                jQuery.parseJSON(data);
                                d.remove();
                                //initPop('数据加载出错,请稍候再试!',22);
                                console.error(jQuery.parseJSON(data));
                            }catch(e){
                                $('.table-wrap').parent().children('h3').remove();
                                $('.table-wrap').before(data);
                            }

                            // $container.children('.table-wrap').html(generateTable(d.header,d.data,d.class)).show();
                            // initPager(d.count,d.pageSize,$('.table-pager'),$('#form01'),$('.table-wrap'))
                        },
                        error: function () {
                            console.error('网络出错:Form02');
                        }
                    })
                }
            }())
        }

        if($('#form03').length>0){
            (function () {
                if(G_DATAAJAX3!=undefined) G_DATAAJAX3.abort();
                var paramObj = {};
                var $tempForm = $('#form01').clone(true);
                $tempForm.find('input[name="id"]').val($('#form03 input[name="id"]').val());

                G_DATAAJAX3 = $.ajax({
                    url: $('#form03').attr('action'),
                    dataType: 'json',
                    data: /*$.param(paramObj) + '&'+*/$tempForm.serialize(),
                    type: 'post',
                    success: function (data) {
                        //如果是评级页面
                        if($('.company-radar-info').length>0){
                            //data = {"respCode":"000","data":[{"SAVE_AMT":50.28,"CASH_AMT":20.96,"LEND_AMT":30.36,"RET_AMT":60.63,"ACCT_MONTH":"201705"},{"SAVE_AMT":100.52,"CASH_AMT":80.01,"LEND_AMT":70.47,"RET_AMT":40.14,"ACCT_MONTH":"201706"},{"SAVE_AMT":50.28,"CASH_AMT":20.96,"LEND_AMT":30.36,"RET_AMT":60.63,"ACCT_MONTH":"201707"},{"SAVE_AMT":10.28,"CASH_AMT":15.96,"LEND_AMT":35.36,"RET_AMT":12.63,"ACCT_MONTH":"201708"},{"SAVE_AMT":40.28,"CASH_AMT":70.96,"LEND_AMT":60.36,"RET_AMT":50.63,"ACCT_MONTH":"201709"},{"SAVE_AMT":105.28,"CASH_AMT":80.96,"LEND_AMT":85.36,"RET_AMT":75.63,"ACCT_MONTH":"201710"},{"SAVE_AMT":40.28,"CASH_AMT":30.96,"LEND_AMT":20.36,"RET_AMT":65.63,"ACCT_MONTH":"201711"},{"SAVE_AMT":55.28,"CASH_AMT":30.96,"LEND_AMT":18.36,"RET_AMT":80.63,"ACCT_MONTH":"201712"}],"respDesc":"success"}

                            if(data.respCode == '000'&&data.data.length>0){
                                var dataLineRada = data.data
                                var tempData = [],axisLabel=[],dataIndex,legend=[],dataIndex=0,axisRadarLabel=[];

                                for(var i in dataLineRada){
                                    dataIndex = 0;
                                    //tempData[dataIndex] = [];
                                    for(var k in dataLineRada[i]){
                                        tempData[dataIndex] = tempData[dataIndex]||[];
                                        tempData[dataIndex].push(dataLineRada[i][k]);
                                        dataIndex++;
                                    }
                                    dataIndex++;
                                }
                                axisRadarLabel = tempData.pop();

                                for(var j in dataLineRada[0]){
                                    legend.push(trendValue[j]); //trendValue由页面配置全局
                                }
                                legend.pop();
                                initRadarLine(legend,tempData,axisRadarLabel)
                            }
                        }else{
                            try{
                                jQuery.parseJSON(data);
                                d.remove();
                                //initPop('数据加载出错,请稍候再试!',22);
                                console.error(jQuery.parseJSON(data));
                            }catch(e){
                                $('.table-wrap').parent().children('h3').remove();
                                $('.table-wrap').before('<h3>'+data+'</h3>');
                            }
                        }

                    },
                    error: function () {
                        console.error('网络出错:Form03');
                    }
                })
            }())
        }
    })


    $('html').on('click','ul.info-list>li',function () {
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $(this).children('ul').hide();
        }else{
            $(this).addClass('open');
            $(this).children('ul').show();
        }
    })

    function initPop(content,height,skin) {
        var skin = skin||'';
        var height = height;
        d = dialog({
            title:'标题',
            content: content,
            fixed:true,
            height:height,
            skin: skin
        });

        //d.reset();
        d.show();
        d.showModal();
    }
})



function initRadar(radaAxis,data) {
    $('.company-radar-map').show(); //先隐藏图表

    if(radarChart!=undefined) radarChart.dispose();
    var radarChart = echarts.init(document.getElementById('radar-wrap'));
    var optionRadar = {
        title: {
            show: false
        },
        legend: {
            show:false
        },
        tooltip: {
            trigger:'item',
            backgroundColor:'#FFF',
            textStyle:{
                color:'#333',
                fontFamily: '微软雅黑',
                fontSize: 14
            }
        },
        radar: [
            {
                indicator: radaAxis,
                name: {
                    textStyle: {
                        color:'#333'
                    }
                },
                radius: 150,
                splitNumber: 5,
                axisLine: {
                    lineStyle:{
                        color:'rgba(232,232,232,1)'
                    }
                },
                splitLine: {
                    lineStyle:{
                        color:['rgba(232,232,232,1)','rgba(232,232,232,1)']
                    }
                },
                splitArea: {
                    areaStyle:{
                        color:['rgba(255,255,255,1)','rgba(249,249,250,1)']
                    }
                },
            }
        ],
        series: [
            {
                type: 'radar',
                areaStyle: {
                    normal: {
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(115,88,191,0.9)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(90,124,195,0.6)' // 100% 处的颜色
                            }],
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#7358bf' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#5a7cc3' // 100% 处的颜色
                            }],
                        },
                        borderColor:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#7358bf' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#5a7cc3' // 100% 处的颜色
                            }],
                        },
                        borderWidth:3
                    }
                },
                data: [
                    {
                        value: data,
                        name: '指标名称',
                        symbolSize:10
                    }
                ]
            }
        ]
    };
    radarChart.setOption(optionRadar);

    $(window).resize(function () {
        radarChart.resize();
    })
}

function initRadarLine(legend,tempData,axisRadarLabel) {
    $('.company-line-map').show();

    //设置legend样式
    var newLegend = [],legendIndex = 0
    for(var l in legend){
        newLegend[legendIndex] = {};
        newLegend[legendIndex].name = legend[l];
        newLegend[legendIndex].icon = 'circle';
        legendIndex++;
    }

    var radarLineChart = echarts.init($('.company-line-map').get(0));
    var optionLine = {
        title: {
            show: false
        },
        color:echartsDefaultColor,
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var html = params[0].axisValue+'<br>';
                for(var i in params){
                    html += '<div><span style="color:'+params[i].color+'">●</span>'+params[i].seriesName+':'+formatCurrency(params[i].value)+'</div>';
                }
                return html;
            }
        },
        legend: {
            data:newLegend,
            bottom:20,
            textStyle:{
                color:'#93a0bf'
            }
        },
        grid: {
            borderColor:'#93a0bf',
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
                    color:'#93a0bf'
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
            data: axisRadarLabel,
        },
        yAxis: {
            type : 'value',
            splitLine: {
                lineStyle:{
                    type:'dashed',
                    color:'#93a0bf'
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
                name:legend[0],
                type:'line',
                smooth:true,
                symbol:'circle',
                symbolSize:6,
                lineStyle:{
                    normal:{
                        width:0
                    }
                },
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
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#5eb2fb'
                        }, {
                            offset: 1,
                            color: 'rgba(94,178,251,0)'
                        }])
                    }
                },
                data:tempData[0]
            },
            {
                name:legend[1],
                type:'line',
                smooth:true,
                symbol:'circle',
                symbolSize:6,
                lineStyle:{
                    normal:{
                        width:0
                    }
                },
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
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#1ebcdb'
                        }, {
                            offset: 1,
                            color: 'rgba(30,188,219,0)'
                        }])
                    }
                },
                data:tempData[1]
            },
            {
                name:legend[2],
                type:'line',
                symbol:'circle',
                symbolSize:6,
                smooth:true,
                lineStyle:{
                    normal:{
                        width:0
                    }
                },
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
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#f24493'
                        }, {
                            offset: 1,
                            color: 'rgba(242,68,147,0)'
                        }])
                    }
                },
                data:tempData[2]
            },
            {
                name:legend[3],
                type:'line',
                smooth:true,
                symbol:'circle',
                symbolSize:6,
                lineStyle:{
                    normal:{
                        width:0
                    }
                },
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
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#a151f0'
                        }, {
                            offset: 1,
                            color: 'rgba(161,81,240,0)'
                        }])
                    }
                },
                data:tempData[3]
            }
        ]
    }

    radarLineChart.setOption(optionLine);

    $(window).resize(function () {
        radarLineChart.resize();
    })
}