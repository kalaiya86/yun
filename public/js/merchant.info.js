var G_DATAAJAX;
$(function () {
    //表单查询
    $('#form01').on('submit',function (e) {
        e.preventDefault();
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
                    $container.children('h3').show();
                    $container.children('.table-wrap').html(generateTable(d.header,d.data,d.class)).show();
                    $('.table-wrap').niceScroll({
                        cursorborder: "0",
                        cursorcolor: "#c0d6f3",
                        background: "#ececec",
                        autohidemode: false
                    });

                    initPager(d.count,d.pageSize,$('.table-pager'),$('#form01'),$('.table-wrap'))
                }else{
                    alert(d.respDesc)
                }
            },
            error: function () {
                alert('网络出错');
            }
        })
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

    $('.content-bottom').on('click','.info-detail',function () {
        if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
        G_DATAAJAX = $.ajax({
            url: '/public/merchant/details/1',
            dataType: 'html',
            //data: $(this).serialize(),
            type: 'get',
            success: function (data) {
                initPop(data);
                $('.pop-detail').niceScroll({
                    cursorborder: "0",
                    cursorcolor: "#c0d6f3",
                    background: "#ececec"
                });
            },
            error: function () {
                alert('网络出错');
            }
        })

    })

    $('.content-bottom').on('click','.info-history',function () {
        if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
        G_DATAAJAX = $.ajax({
            url: '/public/merchant/history/1',
            dataType: 'html',
            //data: $(this).serialize(),
            type: 'get',
            success: function (data) {
                console.log(data)
                initPop(data);
                $('.pop-history').niceScroll({
                    cursorborder: "0",
                    cursorcolor: "#c0d6f3",
                    background: "#ececec"
                });
            },
            error: function () {
                alert('网络出错');
            }
        })
    })

    function initPop(content) {
        var d = dialog({
            title:'标题',
            content: content,
            fixed:true,
            height:$(window).height()-200
        });
        d.show();
        d.showModal();
    }
})