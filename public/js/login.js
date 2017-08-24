var G_DATAAJAX;
$(function () {
    $('#form1 img').click(function () {
        var link = $(this).attr('src');
        $(this).attr('src',link+'?'+Math.random()*1000);
    })

    $('#form1').on('submit',function (e) {
        e.preventDefault();
        if($('input[name="email"]').val()==''){
            pop('请输入邮箱地址');
            return;
        };
        if($('input[name="password"]').val()==''){
            pop('请输入密码');
            return;
        };
        if($('input[name="captcha"]').val()==''){
            pop('请输入验证码');
            return;
        };

        $('#form1 button').html('登录中...');

        if(G_DATAAJAX!=undefined) G_DATAAJAX.abort();
        G_DATAAJAX = $.ajax({
            url: $('#form1').attr('action'),
            dataType: 'json',
            data: /*$.param({'currentPage':pageInfo.pageIndex+1}) + '&'+*/$('#form1').serialize(),
            type: 'post',
            success: function (data) {
                if(data.respCode == '000'){
                    location.href = data.returnUrl;
                }else{
                    $('#form1 button').html('登陆');
                    $('#form1 img').trigger('click');
                    pop(data.respDesc);
                }
            },
            error: function () {
                $('#form1 img').trigger('click');
                $('#form1 button').html('登陆');
                pop('网络错误');
            }
        })
    })

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
})