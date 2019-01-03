/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
function add_system(url_add_system, csrf_token, system_id) {
    var add_system_dialog;
    $('.add-system').bind('click', function () {
        add_system_dialog = dialog({
            id: 'add_system_dialog',
            title: '<span style="font-size: 15px;">'+gettext('添加新组件系统')+'</span>',
            content: $('#system-add-tmpl'),
            width: 800,
            fixed: true,
        });

        add_system_dialog.showModal();
    });

    $('#add_system_btn').bind('click', function () {
        var continue_flag = true
        if(!$("#system-add-tmpl").find('#id_name').val()){
            $("#system-add-tmpl").find('.form-group').eq(0).addClass('has-error');
            var item_nam = $("#system-add-tmpl").find('#id_name').next();
            $("#system-add-tmpl").find('#tip_name').empty();
            item_nam.after('<span id="tip_name" class="tips error">'+gettext('这个字段是必填项。')+'</span>');
            continue_flag = false
        }else{
            $("#system-add-tmpl").find('.form-group').eq(0).removeClass('has-error');
            $("#system-add-tmpl").find('#tip_name').empty();
            continue_flag = true
        }
        if(!$("#system-add-tmpl").find('#id_label').val()){
            $("#system-add-tmpl").find('.form-group').eq(1).addClass('has-error');
            var item_label = $("#system-add-tmpl").find('#id_label').next();
            $("#system-add-tmpl").find('#tip_label').empty();
            item_label.after('<span id="tip_label" class="tips error">'+gettext('这个字段是必填项。')+'</span>');
            continue_flag = false
        }else{
            $("#system-add-tmpl").find('.form-group').eq(1).removeClass('has-error');
            $("#system-add-tmpl").find('#tip_label').empty();
            continue_flag = true
        }
        if(!continue_flag){
            return false
        }
        data = {
            'csrfmiddlewaretoken': csrf_token,
            'name': $("#system-add-tmpl").find('#id_name').val(),
            'label': $("#system-add-tmpl").find('#id_label').val(),
            'interface_admin': $("#system-add-tmpl").find('#id_interface_admin').val(),
            'execute_timeout': $("#system-add-tmpl").find("#id_execute_timeout").val(),
            'query_timeout': $("#system-add-tmpl").find("#id_query_timeout").val(),
            'remark': $("#system-add-tmpl").find('#id_remark').val(),
        };
        $.post(url_add_system, data, function(result){
            add_system_dialog.close();
            $("#system-add-tmpl").find("form")[0].reset();
            if(result['result']){
                var d = dialog({id: 'bktips', fixed: true, content: '<i class="bk-icon icon-check2" style="color: green"></i> ' + gettext('系统创建成功'), title: '<span style="font-size:15px">'+gettext('消息')+'</span>'}).show();
                setTimeout(function(){
                  d.close().remove();
                }, 2000);

                system_id.append('<option value="'+ result['data']['id'] + '">'+result['data']['display_name']+'</option>')
                system_id.find('option[value="' + result['data']['id'] + '"]').attr("selected", true);
                system_id.change();
            }else{
                dialog({id: 'bktips', title: '<span style="font-size: 15px;">'+gettext('消息')+'</span>', fixed: true, content: '<i class="bk-icon icon-close2" style="color: red"></i> ' + gettext('系统创建失败')+': ' + result.error_message}).showModal();
            }
        }, 'json');
    });
    $('#cancel_system_btn').bind('click', function () {
        add_system_dialog.close();
        $("#system-add-tmpl").find("form")[0].reset();
    });
}
