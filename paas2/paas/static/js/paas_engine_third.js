/*
 * 服务器信息相关
 */

function is_third_edit_status(){
    if($("#user_env_table tbody tr.env_edit_status").length > 0){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('不可同时修改多个第三方服务信息，请先保存编辑中的第三方服务信息')}).time(5);
        return true;
    }
    return false;
}

 //添加变量
$('.env_add_btn').on('click',function(){
    if(is_third_edit_status())return false;
    var tpl = [
                '<tr class="env_record env_edit_status">',
                '<input  type="hidden" class="server_id" disabled value="" />',
                '    <td>',
                '       <input class="form-control server_ips"  value="" placeholder="'+gettext('请输入服务器地址, 存在多个用英文分号分隔')+'"/>' ,
                '    </td>',
                '    <td>',
                '       <input type="number" min="1" max="65535" class="form-control server_port"  value="15672" placeholder="'+gettext('请输入端口')+'"/>' ,
                '    </td>',
                '    <td>',
                '           <input class="form-control username" value="" placeholder="'+gettext('请输入用户名')+'"/>',
                '    </td>',
                '    <td>',
                '        <input class="form-control password" value="" placeholder="'+gettext('请输入密码')+'"/>',
                '    </td>',
                '    <td>',
                '       <select class="form-control server_cate"  placeholder="'+gettext('请选择服务器类型')+'">' ,
                '           <option value="rabbitmq">'+gettext('RabbitMQ服务')+'</option>',
                '       <\select>',
                '    </td>',
                '    <td>',
                '        <span class="server_active">'+gettext('否')+'</span>',
                '    </td>',
                '    <td>',
                '    <button type="button" class="btn-info btn-xs env_save_btn">'+gettext('保存')+'</button>',
                '       <button type="button" class="btn-xs env_cancel_btn">'+gettext('取消')+'</button> ',
                '  <a href="###" title="'+gettext('编辑')+'" class="dev_env_opera env_edit_btn"><span aria-hidden="true" class="glyphicon glyphicon-edit"></span></a>',
                '  <a href="###" title="'+gettext('删除')+'" class="dev_env_opera env_del_btn"><span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span></a>',
                '  <a href="###" title="'+gettext('激活')+'" class="dev_env_opera env_active_btn"><span aria-hidden="true" class="glyphicon glyphicon-saved"></span></a>',
                '    </td>',
                '</tr>'
              ].join('');

        $('#no_record_row').hide();
        $('#user_env_table').append($(tpl));
    return false;
});
// 保存
$('#user_env_table').on('click','.env_save_btn',function(){
    var btn_obj = $(this);
    var curRecord = $(this).closest('.env_record');
    var server_ips = curRecord.find('.server_ips').val();
    var server_port = curRecord.find('.server_port').val();
    var username = curRecord.find('.username').val();
    var password = curRecord.find('.password').val();
    var server_cate = curRecord.find('.server_cate').val();
    var server_id = curRecord.find('.server_id').val();
    //var recordId =  $(this).val();
    if (!server_ips){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请输入正确的地址')}).time(1);
        curRecord.find('.server_ips').focus();
        return false;
    }
    if (!UTILS.isInt(server_port) || parseInt(server_port) < 0 || parseInt(server_port) > 65535){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请输入正确的端口')}).time(1);
        curRecord.find('.server_port').focus();
        return false;
    }
    if (!username){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请输入正确的用户名')}).time(1);
        curRecord.find('.username').focus();
        return false;
    }
    if (!password){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请输入正确的密码')}).time(1);
        curRecord.find('.password').focus();
        return false;
    }
    if (password.match(/[\u3400-\u9FBF]/)) {
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('密码不能包含中文字符')}).time(1);
        curRecord.find('.password').focus();
        return false;
    }
    if (!server_cate){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请选择服务器类型')}).time(1);
        curRecord.find('.server_cate').focus();
        return false;
    }
    if (server_id){
        // 有记录id则进行修改
        var url = BLUEKING.config.paas_host() + 'engine/add_third_server_info/';
        $.post(url,
                {
                'server_ips': server_ips,
                'server_port': server_port,
                'username': username,
                'password': password,
                'server_cate': server_cate,
                'server_id': server_id
               },
               function(data,status){
                    if(status == "success"){
                        if (data.result){
                            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: gettext('保存成功')}).time(1);
                            curRecord.find('input').attr('disabled','disabled');
                            curRecord.find('select').attr('disabled','disabled');
                            curRecord.removeClass('env_edit_status');
                        }else{
                            art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.msg});
                        }
                    }else{
                        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('保存失败')});
                    };
               }
        ,'json');
    }else{
        // 没有记录id则进行添加
        var url = BLUEKING.config.paas_host() + 'engine/add_third_server_info/';
        $.post(url,
               {
                'server_ips': server_ips,
                'server_port': server_port,
                'username': username,
                'password': password,
                'server_cate': server_cate
               },
               function(data, status){
                    if(status == "success"){
                        if (data.result){
                            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: gettext('添加成功')}).time(1);
                            server_data = data.data
                            curRecord.find('.server_id').val(server_data.server_id);

                            curRecord.find('input').attr('disabled','disabled');
                            curRecord.find('select').attr('disabled','disabled');
                            curRecord.removeClass('env_edit_status');
                        }else{
                            art.dialog({id: 'bktips', width: 400,icon: 'error',lock: true,content: data.msg});
                            //curRecord.remove();
                        }
                    }else{
                        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('添加失败')});
                        //curRecord.remove();
                    };
               }
        ,'json');
    }
    return false;
});
//编辑
$('#user_env_table').on('click','.env_edit_btn',function(){
    if(is_third_edit_status())return false;
    var curRecord = $(this).closest('.env_record');
    curRecord.addClass('env_edit_status');
    curRecord.find('input').removeAttr('disabled');
    curRecord.find('select').removeAttr('disabled');

    var  server_ips = curRecord.find('.server_ips').val();
    var server_port = curRecord.find('.server_port').val();
    var server_cate = curRecord.find('.server_cate').val();
    var username = curRecord.find('.username').val();
    var password = curRecord.find('.password').val();

    //保存旧值
    curRecord.attr('data-old-ip',server_ips);
    curRecord.attr('data-old-port',server_port);
    curRecord.attr('data-old-cate',server_cate);
    curRecord.attr('data-old-username',username);
    curRecord.attr('data-old-password', password);

    return false;
});
// 取消编辑
$('#user_env_table').on('click','.env_cancel_btn',function(){
    var curRecord = $(this).closest('.env_record');
    curRecord.removeClass('env_edit_status');

    curRecord.find('input').attr('disabled','disabled');
    curRecord.find('select').attr('disabled','disabled');

    //显示旧值
    var server_ips = curRecord.attr('data-old-ip');
    var server_port = curRecord.attr('data-old-port');
    var server_cate = curRecord.attr('data-old-cate');
    var username = curRecord.attr('data-old-username');
    var password = curRecord.attr('data-old-password');

    if (server_ips || server_port || server_cate || username || password){
        curRecord.find('.server_ips').val(server_ips);
        curRecord.find('.server_port').val(server_port);
        curRecord.find('.server_cate').val(server_cate);
        curRecord.find('.username').val(username);
        curRecord.find('.password').val(password);
    }else{
        curRecord.remove();
    }

    return false;
});
//删除
$('#user_env_table').on('click','.env_del_btn',function(){
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var server_ips = curRecord.find('.server_ips').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    console.log(server_id);
    if (server_id){
        var url = BLUEKING.config.paas_host() + 'engine/del_third_server_info/';
        var content = "<div class='t_s14'>"+gettext("您确定删除该服务器吗?")+"<br>IP : "+server_ips+" , "+gettext("端口")+" : "+server_port+"</div>";
        var width = 340;
        if (server_active == '1'){
            var width = 460;
            content += "<div style='color:red;margin-top: 10px;font-size: 14px;font-weight: bold;'>"+gettext("该服务器已经激活，删除后应用中的celery任务将不能正常执行")+"<br>"+gettext("请确认不再使用后再删除")+"</div>"
        }
        art.dialog({
            title: gettext("删除确认"),
            width: width,
            icon: 'question',
            lock: true,
            content: content,
            ok: function(){
                art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: gettext('正在进行删除操作，请稍后...')});
                $.post(url,
                       {server_id:server_id},
                       function(data){
                            art.dialog({id: 'bktips'}).close();
                            if(data.result){
                                art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: data.msg}).time(1);
                                curRecord.remove();
                            }else{
                                art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.msg});
                    }
                }, 'json')
            },
            cancel: function(){},
            okVal: gettext("确认删除"),
            cancelVal: gettext("取消")
        });
    }
});
//激活服务器
$('#user_env_table').on('click','.env_active_btn',function(){
    var curButon = $(this).closest('.env_active_btn');
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var  server_ips = curRecord.find('.server_ips').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    console.log(server_id);
    if (server_id){
        var url = BLUEKING.config.paas_host() + 'engine/active_third_server/';
        var content = "<div class='t_s14'>"+gettext("正在检测服务器状态，请稍后....")+"<br><br>"+gettext("地址")+" : "+server_ips+" , "+gettext("端口")+" : "+server_port+"</div>";
        art.dialog({id: 'bktips', width: 450, height:200, icon: 'face-smile',lock: true,content: content});
        $.post(url,
               {server_id:server_id},
               function(data){
                    art.dialog({id: 'bktips'}).close();
                    if(data.result){
                        art.dialog({id: 'bktips',icon: 'succeed',lock: true,content: data.msg}).time(1);
                        curRecord.find('.server_active').attr('data', '1');
                        curRecord.find('.server_active').text(gettext('是'));
                        curButon.removeClass('env_active_btn').addClass('env_refresh_btn').html('<span aria-hidden="true" class="glyphicon  glyphicon-refresh"></span>');
                        //curButon.remove();
                    }else{
                        art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.msg});
            }
        }, 'json')
    }
});

//刷新服务器状态
$("#user_env_table").on('click', '.env_refresh_btn', function(){
    var curButon = $(this).closest('.env_refresh_btn');
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var  server_ips = curRecord.find('.server_ips').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    if(server_id){
        var url = BLUEKING.config.paas_host() + 'engine/refresh_third_server/';
        var content = "<div class='t_s14'>"+gettext("正在刷新服务器上的agent状态，请稍后....")+"<br><br>"+gettext("地址")+" : "+server_ips+" , "+gettext("Agent端口")+" : "+server_port+"</div>";
        art.dialog({id: 'bktips', width: 450, height:200, icon: 'face-smile',lock: true,content: content});
        $.post(url,
               {server_id:server_id},
               function(data){
                    art.dialog({id: 'bktips'}).close();
                    if(data.result){
                        if(data.code=='0'){
                            // 服务器已经激活
                            art.dialog({id: 'bktips',icon: 'succeed',lock: true,content: data.msg}).time(1);
                            curRecord.find('.server_active').attr('data', '1');
                            curRecord.find('.server_active').text(gettext('是'));
                            curButon.removeClass('env_active_btn').addClass('env_refresh_btn').html('<span aria-hidden="true" class="glyphicon  glyphicon-refresh"></span>');
                            curButon.attr('title', gettext('刷新'));
                        }else{
                            // 服务器未激活
                            art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.msg});
                            curRecord.find('.server_active').attr('data', '0');
                            curRecord.find('.server_active').text(gettext('否'));
                            curButon.removeClass('env_refresh_btn').addClass('env_active_btn').html('<span aria-hidden="true" class="glyphicon glyphicon-saved"></span>');
                            curButon.attr('title', gettext('激活'))
                        }
                    }else{
                        art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.msg});
            }
        }, 'json')
    }
})
