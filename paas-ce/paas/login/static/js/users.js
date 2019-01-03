/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/*
 * 用户管理
 */
//enter键触发搜索
function enter_keyword(e){
    if(e.keyCode=='13'){
        $('#serach_user').click();
    }
}
// 检查是否有用户信息在编辑中状态
function is_user_edit_status(){
    if($("#user_table_div table tbody tr.user_edit_status").length > 0){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('不可同时修改多个用户信息，请先保存编辑中的用户信息')}).time(5);
        return true;
    }
    return false;
}
// 选择用户角色
$("#search_role").on('onchange', function(){
    get_user(1);
})
// 查询用户
$("#serach_user").on('click', function(){
    get_user(1);
})
function get_user(page){
    var search_data = $("#search_data").val();
    var search_role = $("#search_role").val();
    var url = site_url + 'accounts/user/list/query/';
    $.get(url, {
        'page': page,
        'search_data': search_data,
        'search_role': search_role
    }, function(data){
        $("#user_table_div").html(data);
    })
 }
 //添加用户
$('.user_add_btn').on('click',function(){
    if(is_user_edit_status())return false;
    var tpl = [
            '<tr class="user_record user_edit_status">',
            '   <td>',
            '       <input class="form-control u_username" placeholder="'+ gettext('请输入用户名') +'"/>',
            '   </td>',
            '    <td>',
            '        <input class="form-control u_chname" placeholder="'+ gettext('请输入姓名') +'"/>',
            '   </td>',
            '   <td>',
            '       <input class="form-control u_phone" placeholder="'+ gettext('请输入联系电话') +'"/>',
            '   </td>',
            '   <td>',
            '       <input class="form-control u_email" placeholder="'+ gettext('请输入邮箱') +'"/>',
            '   </td>',
            '   <td>',
            '       <select class="form-control u_role" style="width:90px">',
            '           <option value="0">'+ gettext("普通用户") +'</option>',
            '           <option value="1">'+ gettext("管理员") +'</option>',
            '           <option value="2">'+ gettext("开发者") +'</option>',
            '           <option value="3">'+ gettext("职能化") +'</option>',
            '           <option value="4">'+ gettext("审计员") +'</option>',
            '       </select>',
            '   </td>',
            '   <td>',
            '       <button type="button" class="btn-xs user_cancel_btn">'+ gettext('取消') + '</button> ',
            '       <button type="button" class="btn-info btn-xs user_save_btn">'+ gettext('保存') +'</button>',
            '       <a href="###" title="'+ gettext('编辑') +'" class="dev_user_opera user_edit_btn"><span aria-hidden="true" class="glyphicon glyphicon-edit"></span></a>',
            '       <a href="###" title="'+ gettext('删除') +'" class="dev_user_opera user_del_btn"><span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span></a>',
            '      <a href="###" title="'+ gettext('重置密码') +'" class="dev_user_opera user_rest_btn"><span aria-hidden="true" class="glyphicon glyphicon-lock"></span></a>',
            '   </td>',
            '</tr>'
              ].join('');

        $('#no_record_row').hide();
        //$(tpl).insertTo('#user_table');
        $('#user_table').prepend($(tpl));
    return false;
});
// 导出用户数据
$(".user_export_btn").on('click', function(){
    window.location.href = site_url + 'accounts/user/export/';
})
// 批量导入用户
$('.user_import_btn').on('click', function(){
    $("#data_files").val('');
    art.dialog({
        id: "bktips",
        title:gettext("批量导入用户"),
        lock: true,
        width: 560,
        content: $("#user_import_div").get(0)
    })
    $("#error_msg").text('');
})
// 导入用户
$('#user_import_div').on('click', '.import_btn', function(){
    var user_file = $("#data_files").val();
    if(user_file){
        $("#sumbit_import").click();
    }else{
        $("#error_msg").text(gettext('请选择一个文件'));
    }
})
// 保存
$('#user_table_div').on('click','.user_save_btn',function(){
    var btn_obj = $(this);
    var curRecord = $(this).closest('.user_record');
    var user_id = curRecord.attr('user_id');
    var u_username = $.trim(curRecord.find('.u_username').val());
    var u_chname = $.trim(curRecord.find('.u_chname').val());
    var u_phone = $.trim(curRecord.find('.u_phone').val());
    var u_email = $.trim(curRecord.find('.u_email').val());
    var u_role = $.trim(curRecord.find('.u_role').val());

    if (!u_username.match(/^[A-Za-z0-9][A-Za-z0-9._]{2,18}[A-Za-z0-9]$/)){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('用户名只能包含数字、字母、下划线和点，且长度在4-20个字符, 且必须以字母或数字开头')});
        curRecord.find('.u_username').focus();
        return false;
    }
    if (!u_chname.match(/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,16}$/)){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('中文名只能包含数字、字母、中文汉字、下划线，长度在1-16个字符')});
        curRecord.find('.u_chname').focus();
        return false;
    }
    if (!u_phone.match(/^\d{10,11}$/)){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('仅支持中国大陆手机号码（11位数字）')});
        curRecord.find('.u_phone').focus();
        return false;
    }
    if (!u_email.match(/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/)){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请输入正确的邮箱格式')});
        curRecord.find('.u_email').focus();
        return false;
    }
    if (!u_role){
        art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: gettext('请选择角色')});
        curRecord.find('.u_role').focus();
        return false;
    }

    if (user_id){
        // 有记录id则进行修改
        var url = site_url + 'accounts/user/' + user_id + '/';
        $.ajax({
            url: url,
            type: "PUT",
            data: {username: u_username, chname: u_chname, phone: u_phone, role: u_role, email: u_email},
            success: function(data){
                if (data.result){
                    art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: gettext('保存成功')}).time(1);
                    curRecord.find('input').attr('disabled','disabled');
                    curRecord.find('select').attr('disabled','disabled');
                    curRecord.removeClass('user_edit_status');
                    var cur_page = $("#current_page").val();
                    get_user(cur_page);
                }else{
                    art.dialog({id: 'bktips', width: 300, icon: 'error', lock: true, content: data.message});
                }
            },
            dataType: "json"
        })
    }else{
        // 没有记录id则进行添加
        var url = site_url + 'accounts/user/';
        $.post(url, {username: u_username, chname: u_chname, phone: u_phone, role: u_role, email: u_email}, function(data){
            if (data.result){
                art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: gettext('添加成功')}).time(1);
                user_data = data.data;
                curRecord.attr('user_id', user_data.user_id);

                curRecord.find('input').attr('disabled','disabled');
                curRecord.find('select').attr('disabled','disabled');
                curRecord.removeClass('user_edit_status');
                get_user(1);
            }else{
                art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message});
                //curRecord.remove();
            }
        }, 'json');
    }
    return false;
});
//编辑
$('#user_table_div').on('click','.user_edit_btn',function(){
    if(is_user_edit_status())return false;
    var curRecord = $(this).closest('.user_record');
    curRecord.addClass('user_edit_status');
    curRecord.find('input').removeAttr('disabled');
    curRecord.find('.u_username').attr('disabled','disabled');
    curRecord.find('select').removeAttr('disabled');

    var u_username = $.trim(curRecord.find('.u_username').val());
    var u_chname = $.trim(curRecord.find('.u_chname').val());
    var u_phone = $.trim(curRecord.find('.u_phone').val());
    var u_role = $.trim(curRecord.find('.u_role').val());
    var u_email = $.trim(curRecord.find('.u_email').val());

    // 编辑时修改 placeholder
    curRecord.find('.u_username').attr('placeholder', gettext('请输入用户名'));
    curRecord.find('.u_chname').attr('placeholder', gettext('请输入中文名'));
    curRecord.find('.u_phone').attr('placeholder', gettext('请输入手机号'));
    curRecord.find('.u_email').attr('placeholder', gettext('请输入邮箱'));

    //保存旧值
    curRecord.attr('data-old-username',u_username);
    curRecord.attr('data-old-chname',u_chname);
    curRecord.attr('data-old-phone',u_phone);
    curRecord.attr('data-old-role',u_role);
    curRecord.attr('data-old-email',u_email);

    return false;
});
// 取消编辑
$('#user_table_div').on('click','.user_cancel_btn',function(){
    var curRecord = $(this).closest('.user_record');
    curRecord.removeClass('user_edit_status');

    curRecord.find('input').attr('disabled','disabled');
    curRecord.find('select').attr('disabled','disabled');

    // 取消编辑时修改 placeholder 为： --
    curRecord.find('.u_username').attr('placeholder', '--');
    curRecord.find('.u_chname').attr('placeholder', '--');
    curRecord.find('.u_phone').attr('placeholder', '--');
    curRecord.find('.u_email').attr('placeholder', '--');

    //显示旧值
    var u_username = curRecord.attr('data-old-username');
    var u_chname = curRecord.attr('data-old-chname');
    var u_phone = curRecord.attr('data-old-phone');
    var u_role = curRecord.attr('data-old-role');
    var u_email = curRecord.attr('data-old-email');

    if (u_username || u_chname || u_phone || u_email){
        curRecord.find('.u_username').val(u_username);
        curRecord.find('.u_chname').val(u_chname);
        curRecord.find('.u_phone').val(u_phone);
        curRecord.find('.u_role').val(u_role);
        curRecord.find('.u_email').val(u_email);
    }else{
        curRecord.remove();
    }
    // 判断是否为最后一行
    var record_len = $("#user_table").find('.user_record').length;
    if(record_len == 0){
        $("#no_record_row").show();
    }
    return false;
});
//删除
$('#user_table_div').on('click','.user_del_btn',function(){
    var curRecord = $(this).closest('.user_record');

    var user_id = curRecord.attr('user_id');
    var u_username = curRecord.find('.u_username').val();
    var u_chname = curRecord.find('.u_chname').val();

    console.log(user_id);
    if (user_id){
        var url = site_url + 'accounts/user/' + user_id + '/';
        var content = "<div class='t_s14'>" + gettext("您确定删除该用户吗?") + "<br>" + gettext("用户名 : ")+ u_username + "</div>";
        var width = 340;
        art.dialog({
            title: gettext("删除确认"),
            width: width,
            icon: 'question',
            lock: true,
            content: content,
            ok: function(){
                art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: gettext('正在进行删除操作，请稍后...')});
                $.ajax({
                    url: url,
                    type: "DELETE",
                    success: function(data){
                        art.dialog({id: 'bktips'}).close();
                        if(data.result){
                            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: data.message}).time(2);
                            curRecord.remove();
                            get_user(1);
                        }else{
                            art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message});
                        }
                    },
                    dataType: "json"
                });
            },
            cancel: function(){},
            okVal: gettext("确认删除"),
            cancelVal: gettext("取消")
        });
    }
});
// 重置密码
$('#user_table_div').on('click','.user_rest_btn',function(){
        $('.error_tip').hide();
        $(".password_input").val('');
        $("#password_tip").text('');
        var curRecord = $(this).closest('.user_record');

        var user_id = curRecord.attr('user_id');
        var username = curRecord.find('.u_username').val();
        art.dialog({
            id: "bkpwd",
            title:gettext("重置密码"),
            lock: true,
            width: 505,
            content: $("#change_password_div").get(0),
            cancelVal: gettext("取消"),
            cancel: function(){
            },
            okVal: gettext("重置密码"),
            ok: function(){
                var flag = true;
                $('.error_tip').hide();
                $("#pattern_tip").css('color', 'black');
                $(".password_input").each(function(){
                    var curl_val = $.trim($(this).val());
                    if(!curl_val){
                        $(this).next('.error_tip').show();
                        $(this).focus();
                        flag = false;
                        return false;
                    }
                    // 第一个密码需要验证格式
                    if (!curl_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9!@#\$%\^\*\(\)-_\+=]{8,20}$/) && $(this).attr('name')=='password1'){
                        $("#pattern_tip").css('color', 'red');
                        $(this).focus();
                        flag = false;
                        return false;
                    }
                });
                if(!flag){
                    return false;
                }
                var password1 = $.trim($("#id_password1").val());
                var password2 = $.trim($("#id_password2").val());
                if(password1 != password2){
                    $("#password_tip").text(gettext('两次输入的新密码不一致'));
                    flag = false;
                }
                if(!flag){
                    return false;
                }else{
                    var url = site_url + 'accounts/user/' + user_id + "/password/";
                    var post_flag = true;
                    $.ajax({
                        url: url,
                        type: 'PUT',
                        data: {'new_password1':password1, 'new_password2':password2},
                        success: function(data){
                            if(!data.result){
                                $("#password_tip").text(data.message);
                                post_flag = false;
                            }
                        },
                        dataType: 'json',
                        async: false,
                    });
                    // 出错则不关闭当前对话框
                    if(!post_flag){
                      return false;
                    }else{
                        art.dialog({width: 300,icon: 'succeed',lock: true,content: gettext('密码重置成功')}).time(2);
                    }
                }
            }
        });
})
