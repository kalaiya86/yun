$(function () {
    // 主菜单
    var hasCurrentSubMenu = $('.sub-menu dd .gradient-border.current');
    var hasCurrentMenu = $('.sub-menu>li').index($('.sub-menu .current.gradient-border').closest('li'));
    if(hasCurrentMenu>=0) {
        $('.menu li').eq(hasCurrentMenu).addClass('hasSub');
    }
    $('.menu>li').on('mouseenter',function () {
        var index = $('.menu>li').index($(this));
        var currentMenu = $('.menu>li').eq(index);
        var currentSubMenu = $('.sub-menu>li').eq(index);

        currentMenu.addClass('current').siblings().removeClass('current');
        currentSubMenu.addClass('current').siblings().removeClass('current');
        $('.sub-menu').addClass('open');
    })

    $('.sub-menu').on('mouseenter',function (e) {
        if ($(e.target).hasClass("sub-menu")&& $(e.target).closest(".menu").length <= 0) {
            $('.sub-menu').removeClass('open');
        }
    })

    $('.sub-menu').on('mouseleave',function (e) {
        if ($(e.target).hasClass("sub-menu")&& $(e.target).closest(".menu").length <= 0) {
            $('.sub-menu').removeClass('open');
        }
    })

    $('.sub-menu dd').on('mouseenter',function () {
        $('.sub-menu dd .gradient-border.current').removeClass('current');
    })

    $('.sub-menu dl').on('mouseleave',function () {
        hasCurrentSubMenu.addClass('current');
        $('.menu li').removeClass('current')
    })
    
    $(window).click(function (e) {
        if ($(e.target).closest(".sub-menu").length <= 0 && $(e.target).closest(".menu").length <= 0) {
            $('.sub-menu').removeClass('open');
        }
    })

    $(window).on('mousemove',function (e) {
        if ($(e.target).closest(".sub-menu").length <= 0 && $(e.target).closest(".menu").length <= 0) {
            $('.sub-menu').removeClass('open');
        }
    })

    //主题切换
    $('.theme').unbind().click(function () {
        if($(this).hasClass('night')){
            $.cookie('theme', 'day',{ expires: 30, path: '/askme/' });
        }else{
            $.cookie('theme', '', { expires: 30 , path: '/askme/'});
        }
        window.location.reload();
    })

    //全屏
    $('.btn-menu').click(function () {
        if($(this).hasClass('full-screen')){
            $(this).removeClass('full-screen');
            $('.content-wrap').removeClass('full-screen');
            $('.top-bar,.menu').removeClass('hide');
            $('.sub-menu').removeClass('hiding');
        }else{
            $(this).addClass('full-screen');
            $('.content-wrap').addClass('full-screen');
            $('.top-bar,.menu').addClass('hide');
            $('.sub-menu').removeClass('open').addClass('hiding');
            $('.sub-menu>.current,.menu>.current').removeClass('current');
        }
    })

    //select初始化
    if($('.real-time').length<=0){
        $('.content-middle select').selectize({
            onFocus : function () {
                //console.log($(this))
                /*$('.selectize-dropdown-content').niceScroll({
                 cursorborder: "0",
                 cursorcolor: "#466592",
                 background: "#3c4364",
                 autohidemode: false
                 });*/
            },
        });
    }

    //清除按钮
    $('.clear-form').click(function () {
        var $that = $(this);
        $form = $that.closest('form');
        $form.find('select').val('');
        $form.find('input').not('input[name="id"]').val('');
        for(var i=0;i<$select.length;i++){
            $select[i].selectize.clear();
        }
    })

    //input自动完成
    $(window).click(function (e) {
        if ($(e.target).closest(".component-input").length <= 0) {
            $('.search-list-wrap').remove();
        }
    })
    $('.content-middle .gradient-border>input').each(function () {
        var $that = $(this);
        var timeout;
        var $el = $that.closest('.component-input');
        var autoCompleteAjax;
        if($that.attr('url')!=undefined){
            $that.on('keyup',function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    var data={};
                    data[$that.attr('name')] = $that.val();
                    //data.id = $that.attr('id');
                    if(autoCompleteAjax) autoCompleteAjax.abort();
                    if($.trim($that.val())==''){
                        $el.find('.search-list-wrap').remove();
                    }else{
                        autoCompleteAjax = $.ajax({
                            url: $that.attr('url'),
                            dataType: 'json',
                            data: data,
                            type: 'get',
                            success: function (data) {
                                var html = '';
                                if(data.data.length!=0){
                                    $el.find('.search-list-wrap').remove();
                                    $el.append('<div class="search-list-wrap"><ul class="search-list"></ul></div>');
                                    if(data.respCode=='000'){
                                        for(var i in data.data){
                                            html += '<li>'+data.data[i].MER_NAME+'</li>'
                                        }
                                    }
                                    var list = $el.find('.search-list')
                                    list.html(html);
                                    list.find('li').unbind().click(function () {
                                        $that.val($(this).html());
                                        $el.find('.search-list-wrap').remove();
                                    })
                                }
                                $('.search-list').niceScroll({
                                    cursorborder: "0",
                                    cursorcolor: "#c0d6f3",
                                    background: "#ececec"
                                });
                            },
                            error: function () {
                                console.error('网络出错:查询按钮请求出错');
                            }
                        })
                    }
                },400)
            })
        }
    })

    //日历初始化
    if($('.component-datepicker input').length>0){
        $('.component-datepicker input:visible').each(function () {
            $(this).dateRangePicker(dateRangePickerOptions).bind('datepicker-change',function(event,obj){
                $(this).closest('.component-datepicker').find('input[type="hidden"]').eq(0).val(moment(obj.date1).format("YYYY-MM-DD"));
                $(this).closest('.component-datepicker').find('input[type="hidden"]').eq(0).val(moment(obj.date1).format("YYYY-MM-DD"));
            });

            $(this).on('input propertychange',function () {
                var startDate = $(this).val().split('至')[0];
                var endDate = $(this).val().split('至')[1];

                $(this).closest('.component-datepicker').find('input[type="hidden"]').eq(0).val(startDate);
                $(this).closest('.component-datepicker').find('input[type="hidden"]').eq(1).val(endDate);
            })

        })

        //为日期组件加上tips
        var tipHtml = '<span class="icon-tips"><span>日期选择范围不可超过30天</span></span>';
        $('.component-datepicker>label').append($(tipHtml));
    }
})

//可以共用的函数

//可以覆盖的日历插件参数
var dateRangePickerOptions = {
    separator:'至',
    showTopbar:false,
    hoveringTooltip:false,
    maxDays:31,
    startDate: '2017-05-01',
    language:'cn',
    customArrowPrevSymbol:'<span class="calendar-btn-left"></span>',
    customArrowNextSymbol:'<span class="calendar-btn-right"></span>',
}

//检查表单有必填项目
function checkHasValue($container) {
    var valNumber = 0;
    $container.find('input:visible').each(function () {
        if($.trim($(this).val())!='') valNumber++;
    })
    $container.find('select:visible').each(function () {
        if($.trim($(this).val())!='') valNumber++;
    })
    if(valNumber>0){
        return true;
    }else{
        return false;
    }
}

//分页初始化
function initPager(count,size,$pageContainer,$form,$tableContainer) {
    $pageContainer.show();
    //初始化分页
    if($pageContainer.pagination()){
        if(count<=size){
            //$pageContainer.pagination('destroy');
        }else{
            $pageContainer.pagination('setPageIndex', 0);
            $pageContainer.pagination('render', count);
        }
    }else{
        $pageContainer.pagination({
            total:count,
            pageSize:size,
            pageBtnCount:7,
            pageIndex:0,
            showJump:false,
        }).on("pageClicked", function (event, pageInfo) {
            $('.table-wrap').empty();
            $tableContainer.html('<div class="data-loading">数据加载中....</div>');

            if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
            G_DATAAJAX = $.ajax({
                url: $form.attr('action'),
                dataType: 'json',
                data: $.param({'currentPage':pageInfo.pageIndex+1}) + '&'+$form.serialize(),
                type: 'post',
                success: function (data) {
                    var d = data;
                    if(d.respCode=='000'){
                        if(d.data.length==0){
                            $tableContainer.html('<div class="data-loading">查询无数据</div>');
                        }else{
                            $tableContainer.html(generateTable(d.header,d.data,d.class));
                            $('.table-wrap').niceScroll({
                                cursorborder: "0",
                                cursorcolor: "#c0d6f3",
                                background: "#ececec"
                            });
                        }
                    }else{
                        pop(d.respDesc)
                    }
                },
                error: function () {
                    console.error('网络出错:分页请求出错');
                }
            })
        }).on('jumpClicked', function (event, pageInfo) {
            //console.log(pageIndex)

        }).on('pageSizeChanged', function (event, pageInfo) {
            //console.log(pageSize)
        });
    }
}

//弹出框分页初始化
function initPagerPop(count,size,$contentWrap,$pageContainer) {

    $pageContainer.show();
    //初始化分页
    if($pageContainer.pagination()){
        if(count<=size){
            $pageContainer.pagination('destroy');
        }else{
            $pageContainer.pagination('setPageIndex', 0);
            $pageContainer.pagination('render', count);
        }
    }else{
        $pageContainer.pagination({
            total:count,
            pageSize:size,
            pageBtnCount:7,
            pageIndex:0,
            showJump:false,
        }).on("pageClicked", function (event, pageInfo) {
            //$('.info-list').empty();
            $contentWrap.html('<div class="data-loading">数据加载中....</div>');

            if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
            G_DATAAJAX = $.ajax({
                url: $pageContainer.attr('request-url'),
                dataType: 'html',
                data: $.param({'currentPage':pageInfo.pageIndex+1})/* + '&'+$form.serialize()*/,
                type: 'post',
                success: function (data) {
                    var html = $(data).find('.pop-content-wrap');
                    if(d.respCode=='000'){
                        if(d.data.length==0){
                            $contentWrap.html('<div class="data-loading">查询无数据</div>');
                        }else{

                        }
                    }else{
                        $contentWrap.html(html)
                    }
                },
                error: function () {
                    console.error('网络出错:分页请求出错');
                }
            })
        }).on('jumpClicked', function (event, pageInfo) {
            //console.log(pageIndex)

        }).on('pageSizeChanged', function (event, pageInfo) {
            //console.log(pageSize)
        });
    }
}

//生成表格
function generateTable(thead,tbody,className) {
    var html = '';

    html += '<table class="matrix component-table"><thead><tr>';
    for(var i in thead){
        html += ('<th>'+thead[i]+'</th>');
    }
    html += '</th></thead><tbody>';
    for(var j in tbody){
        html += '<tr>';
        for(var k in tbody[j]){

            //表格字段格式化
            var text = '';
            if(className[k]=='money'){
                text = tbody[j][k].formatNum(2);
                text = formatCurrency(text);
            }else if(className[k]=='yyyy-mm-dd'){
                text = moment(tbody[j][k]).format("YYYY-MM-DD");
            }else if(className[k].indexOf('text_max_length_')>=0){

                var dots = (tbody[j][k].length<=className[k].split('text_max_length_')[1])?'':'...'
                var tip = (tbody[j][k].length<=className[k].split('text_max_length_')[1])?'':'<span>'+tbody[j][k]+'</span>'
                text = tbody[j][k].substring(0,className[k].split('text_max_length_')[1])+dots+tip;

            }else{
                text = tbody[j][k]
            }

            html += ('<td class="'+className[k]+'">'+text+'</td>');
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

var echartdsDefaultColor = ['#5eb2fb','#1ebcdb', '#f24493', '#a151f0', '#f9ec98','#5ba6e9','#a68eea', '#7bdec8','#6e7074', '#546570', '#c4ccd3']

function pop(content) {
    $('.ui-popup').next().remove();
    $('.ui-popup,.ui-popup-backdrop').remove();
    var d = dialog({
        title:'标题',
        content: content,
        fixed:true,
        skin: 'dialog-error'
    });
    d.show();
    d.showModal();
}

function isZsError(data) {

}

//价格千分位分割
function formatCurrency(num)
{
    if(num)
    {
        num = num.formatNum(2);
        //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
        num = num.toString().replace(/\$|\,/g,'');
        //如果num是--，则将返回--
        if(num=="--"){return '--';}
        //如果num不是数字，则将num置0，并返回
        if(''==num || isNaN(num)){return 'Not a Number ! ';}
        //如果num是负数，则获取她的符号
        var sign = num.indexOf("-")> 0 ? '-' : '';
        //如果存在小数点，则获取数字的小数部分
        var cents = num.indexOf(".")> 0 ? num.substr(num.indexOf(".")) : '';
        cents = cents.length>1 ? cents : '' ;//注意：这里如果是使用change方法不断的调用，小数是输入不了的
        //获取数字的整数数部分
        num = num.indexOf(".")>0 ? num.substring(0,(num.indexOf("."))) : num ;
        //如果没有小数点，整数部分不能以0开头
        if('' == cents){ if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else{if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
        /*
         也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
         字符串长度为0/1/2/3时都不用添加
         字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
         */
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        {
            num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
        }
        //将数据（符号、整数部分、小数部分）整体组合返回
        return "￥"+(sign + num + cents);
    }
}

function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式

    var aDate, oDate1, oDate2, iDays;

    aDate = sDate1.split("-");
    oDate1 = new Date(/*aDate[1] + '-' + aDate[2] + '-' + aDate[0]*/sDate1);  //转换为yyyy-MM-dd格式
    aDate = sDate2.split("-");
    oDate2 = new Date(/*aDate[1] + '-' + aDate[2] + '-' + aDate[0]*/sDate2);

    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数

    return iDays;  //返回相差天数
}


/*
 * 格式化数字
 * N 格式化几位
 * e 一共显示多少位数
 * */
String.prototype.formatNum = function (n,e) {
    var s = this;
    var _a = "";
    var _e = "";
    if(s=="--") return "--";
    if(s=="" || s==".") return "";

    if(parseFloat(this)<0){
        _a = "-";
        s = s.replace("-","");
    }
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
    }
    if(e!==undefined){
        if(t.length>e-(n+1)){
            _e = _a+""+t.split("").reverse().join("")
        }else{
            _e = _a+""+t.split("").reverse().join("") + "." + r
        }
    }else{
        _e = _a+""+t.split("").reverse().join("") + "." + r
    }

    return _e;
}


/*
 * 格式化数字
 * N 格式化几位
 * e 一共显示多少位数
 * */
Number.prototype.formatNum = function (n,e) {
    var s = this;
    var _a = "";
    var _e = "";
    if(s=="--") return "--";
    if(s=="" || s==".") return "";
    if(parseFloat(this)<0){
        _a = "-";
        s = s.replace("-","");
    }
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
    }
    if(e!==undefined){
        if(t.length>e-(n+1)){
            _e = _a+""+t.split("").reverse().join("")
        }else{
            _e = _a+""+t.split("").reverse().join("") + "." + r
        }
    }else{
        _e = _a+""+t.split("").reverse().join("") + "." + r
    }

    return _e;
}