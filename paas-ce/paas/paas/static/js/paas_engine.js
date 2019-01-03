/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/*
 * 服务器信息相关
 */
 //添加变量
$('.env_add_btn').on('click',function(){
    var tpl = [
                '<tr class="env_record env_edit_status">',
                '<input  type="hidden" class="server_id" disabled value="" />',
                '    <td>',
                '       <div class="env_key_box">',
                '           <span class="s_id"></span>',
                '        </div>',
                '    </td>',
                '    <td>',
                '        <span class="server_token"></span>',
                '    </td>',
                '    <td>',
                '       <input class="form-control server_ip"  value="" placeholder="请输入服务器IP"/>' ,
                '    </td>',
                '    <td>',
                '       <input type="number" min="1" max="65535" class="form-control server_port"  value="4245" placeholder="请输入Agent端口"/>' ,
                '    </td>',
                '    <td>',
                '       <input type="number" min="1" max="65535" class="form-control app_port"  value="8085" placeholder="请输入App服务端口"/>' ,
                '    </td>',
                '    <td>',
                '       <select class="form-control server_cate"  placeholder="请选择服务器类别">' ,
                '           <option value="tapp">测试服务器</option>',
                '           <option value="app">正式服务器</option>',
                '       <\select>',
                '    </td>',
                '    <td>',
                '        <span class="server_active">否</span>',
                '    </td>',
                '    <td>',
                '    <button type="button" class="btn-info btn-xs env_save_btn">保存</button>',
                '       <button type="button" class="btn-xs env_cancel_btn">取消</button> ',
                '  <a href="###" title="编辑" class="dev_env_opera env_edit_btn"><span aria-hidden="true" class="glyphicon glyphicon-edit"></span></a>',
                '  <a href="###" title="删除" class="dev_env_opera env_del_btn"><span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span></a>',
                '  <a href="###" title="激活" class="dev_env_opera env_active_btn"><span aria-hidden="true" class="glyphicon glyphicon-saved"></span></a>',
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
    var  server_ip = curRecord.find('.server_ip').val();
    var server_port = curRecord.find('.server_port').val();
    var app_port = curRecord.find('.app_port').val();
    var server_cate = curRecord.find('.server_cate').val();
    var server_id = curRecord.find('.server_id').val();
    //var recordId =  $(this).val();
    if (!server_ip){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '请输入正确的IP地址'}).time(2);
        curRecord.find('.server_ip').focus();
        return false;
    }
    if (!UTILS.isInt(server_port) || parseInt(server_port) < 0 || parseInt(server_port) > 65535){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '请输入正确的Agent端口'}).time(2);
        curRecord.find('.server_port').focus();
        return false;
    }
    if (!UTILS.isInt(app_port) || parseInt(app_port) < 0 || parseInt(app_port) > 65535){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '请输入正确的App服务端口'}).time(2);
        curRecord.find('.app_port').focus();
        return false;
    }
    if (!server_cate){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '请选择服务器类别'}).time(2);
        curRecord.find('.server_cate').focus();
        return false;
    }

    if (server_id){
        // 有记录id则进行修改
        var url = BLUEKING.config.paas_host() + 'engine/server/';
        $.post(url,
                {server_ip: server_ip,
                server_port: server_port,
                app_port: app_port,
                server_cate: server_cate,
                server_id: server_id
               },
               function(data, status){
                    if(status == "success"){
                        if (data.result){
                            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: '保存成功'}).time(1);
                            curRecord.find('input').attr('disabled','disabled');
                            curRecord.find('select').attr('disabled','disabled');
                            curRecord.removeClass('env_edit_status');
                        }else{
                            art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message});
                        }
                    }else{
                        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '保存失败'});
                    };
               }
        ,'json');
    }else{
        // 没有记录id则进行添加
        var url = BLUEKING.config.paas_host() + 'engine/server/';
        $.post(url,
               {server_ip: server_ip,
                server_port: server_port,
                app_port: app_port,
                server_cate: server_cate
               },
               function(data, status){
                    if(status == "success"){
                        if (data.result){
                            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: '添加成功'}).time(1);
                            server_data = data.data
                            curRecord.find('.server_id').val(server_data.server_id);
                            curRecord.find('.s_id').text(server_data.s_id);
                            curRecord.find('.server_token').text(server_data.token);

                            curRecord.find('input').attr('disabled','disabled');
                            curRecord.find('select').attr('disabled','disabled');
                            curRecord.removeClass('env_edit_status');
                        }else{
                            art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message});
                            //curRecord.remove();
                        }
                    }else{
                        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: '添加失败'});
                        //curRecord.remove();
                    };
               }
        ,'json');
    }
    return false;
});
//编辑
$('#user_env_table').on('click','.env_edit_btn',function(){
    var curRecord = $(this).closest('.env_record');
    curRecord.addClass('env_edit_status');
    curRecord.find('input').removeAttr('disabled');
    curRecord.find('select').removeAttr('disabled');

    var  server_ip = curRecord.find('.server_ip').val();
    var server_port = curRecord.find('.server_port').val();
    var server_cate = curRecord.find('.server_cate').val();
    var app_port = curRecord.find('.app_port').val();

    //保存旧值
    curRecord.attr('data-old-ip',server_ip);
    curRecord.attr('data-old-port',server_port);
    curRecord.attr('data-old-cate',server_cate);
    curRecord.attr('data-old-app-port',app_port);

    return false;
});
// 取消编辑
$('#user_env_table').on('click','.env_cancel_btn',function(){
    var curRecord = $(this).closest('.env_record');
    curRecord.removeClass('env_edit_status');

    curRecord.find('input').attr('disabled','disabled');
    curRecord.find('select').attr('disabled','disabled');

    //显示旧值
    var server_ip = curRecord.attr('data-old-ip');
    var server_port = curRecord.attr('data-old-port');
    var server_cate = curRecord.attr('data-old-cate');
    var app_port = curRecord.attr('data-old-app-port');

    if (server_ip || server_port || server_cate || app_port){
        var envName = curRecord.find('.server_ip').val(server_ip);
        var envKey = curRecord.find('.server_port').val(server_port);
        var envVal = curRecord.find('.server_cate').val(server_cate);
        curRecord.find('.app_port').val(app_port);
    }else{
        curRecord.remove();
    }

    return false;
});
//删除
$('#user_env_table').on('click','.env_del_btn',function(){
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var  server_ip = curRecord.find('.server_ip').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    console.log(server_id);
    if (server_id){
        var url = BLUEKING.config.paas_host() + 'engine/server/' + server_id + '/';
        var content = "<div class='t_s14'>您确定删除该服务器吗?<br>IP : "+server_ip+" , Agent端口 : "+server_port+"</div>";
        var width = 340;
        if (server_active == '1'){
            var width = 440;
            content += "<div style='color:red;margin-top: 10px;font-size: 14px;font-weight: bold;'>该服务器已经激活，删除后将不能在该机器上部署应用<br>请确认不再使用后再删除</div>"
        }
        art.dialog({
            title: "删除确认",
            width: width,
            icon: 'question',
            lock: true,
            content: content,
            ok: function(){
                art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: '正在进行删除操作，请稍后...'});
                $.ajax({
                  url: url,
                  type: "DELETE",
                  success: function(data){
                            art.dialog({id: 'bktips'}).close();
                            if(data.result){
                                art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: data.message}).time(1);
                                curRecord.remove();
                            }else{
                                art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message});
                            }
                  },
                })
            },
            cancel: function(){},
            okVal: "确认删除",
            cancelVal: "取消"
        });
    }
});
//激活服务器
$('#user_env_table').on('click','.env_active_btn',function(){
    var curButon = $(this).closest('.env_active_btn');
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var  server_ip = curRecord.find('.server_ip').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    if (server_id){
        var url = BLUEKING.config.paas_host() + 'engine/server/active/';
        var content = "<div class='t_s14'>正在检测服务器上的agent状态，请稍后....<br><br>IP : "+server_ip+" , Agent端口 : "+server_port+"</div>";
        art.dialog({id: 'bktips', width: 450, height:200, icon: 'face-smile',lock: true,content: content});
        $.post(url,
               {server_id:server_id},
               function(data){
                    art.dialog({id: 'bktips'}).close();
                    if(data.result){
                        art.dialog({id: 'bktips',icon: 'succeed',lock: true,content: data.message}).time(1);
                        curRecord.find('.server_active').attr('data', '1');
                        curRecord.find('.server_active').text('是');
                        curButon.removeClass('env_active_btn').addClass('env_refresh_btn').html('<span aria-hidden="true" class="glyphicon  glyphicon-refresh"></span>');
                        //curButon.remove();
                    }else{
                        art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.message}).time(3);
                    }
               }, 'json')
    }
});

//刷新服务器状态
$("#user_env_table").on('click', '.env_refresh_btn', function(){
    var curButon = $(this).closest('.env_refresh_btn');
    var curRecord = $(this).closest('.env_record');
    var server_id = curRecord.find('.server_id').val();
    var  server_ip = curRecord.find('.server_ip').val();
    var server_port = curRecord.find('.server_port').val();
    var server_active = curRecord.find('.server_active').attr('data');
    if(server_id){
        var url = BLUEKING.config.paas_host() + 'engine/server/refresh/';
        var content = "<div class='t_s14'>正在刷新服务器上的agent状态，请稍后....<br><br>IP : "+server_ip+" , Agent端口 : "+server_port+"</div>";
        art.dialog({id: 'bktips', width: 450, height:200, icon: 'face-smile',lock: true,content: content});
        $.post(url,
               {server_id:server_id},
               function(data){
                    art.dialog({id: 'bktips'}).close();
                    if(data.result){
                        // 服务器已经激活
                        art.dialog({id: 'bktips',icon: 'succeed',lock: true,content: data.message}).time(1);
                        curRecord.find('.server_active').attr('data', '1');
                        curRecord.find('.server_active').text('是');
                        curButon.removeClass('env_active_btn').addClass('env_refresh_btn').html('<span aria-hidden="true" class="glyphicon  glyphicon-refresh"></span>');
                        curButon.attr('title', '刷新');
                    }else{
                        // 服务器未激活
                        art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.message});
                        curRecord.find('.server_active').attr('data', '0');
                        curRecord.find('.server_active').text('否');
                        curButon.removeClass('env_refresh_btn').addClass('env_active_btn').html('<span aria-hidden="true" class="glyphicon glyphicon-saved"></span>');
                        curButon.attr('title', '激活')
                    }

                    // if(data.result){
                    //     if(data.code=='0'){
                    //         // 服务器已经激活
                    //         art.dialog({id: 'bktips',icon: 'succeed',lock: true,content: data.message}).time(1);
                    //         curRecord.find('.server_active').attr('data', '1');
                    //         curRecord.find('.server_active').text('是');
                    //         curButon.removeClass('env_active_btn').addClass('env_refresh_btn').html('<span aria-hidden="true" class="glyphicon  glyphicon-refresh"></span>');
                    //         curButon.attr('title', '刷新');
                    //     }else{
                    //         // 服务器未激活
                    //         art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.message});
                    //         curRecord.find('.server_active').attr('data', '0');
                    //         curRecord.find('.server_active').text('否');
                    //         curButon.removeClass('env_refresh_btn').addClass('env_active_btn').html('<span aria-hidden="true" class="glyphicon glyphicon-saved"></span>');
                    //         curButon.attr('title', '激活')
                    //     }
                    // }else{
                    //     art.dialog({id: 'bktips',width: 450, height:200, icon: 'error',lock: true,content: data.message});
                    // }

        }, 'json')
    }
})
