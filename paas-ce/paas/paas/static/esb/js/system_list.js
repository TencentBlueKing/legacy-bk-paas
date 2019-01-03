/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function(){
    var systems_manager = {
        get_selected_system_ids: function() {
            var result = []
            $('input[name="system_id"]:checked').each(function(i, j){
                result.push($(j).val());
            });
            return result;
        }
    };

    // 绑定checkbox修改事件
    $('input[name="system_id"]').bind('change', function(event){
        if ($(this).is(':checked')) {
            $(this).parents('tr').addClass('row-selected');
        } else {
            $(this).parents('tr').removeClass('row-selected');
        }
    });

    // 为删除按钮绑定事件
    $('#systems_delete').bind('click', function(){
        system_ids = systems_manager.get_selected_system_ids();
        if (system_ids.length === 0) {
          dialog({id: 'bktips', fixed: true, title: "<span style='font-size: 15px;'>" + gettext("消息") + "</span>", content: '<i class="bk-icon icon-close2" style="color: red"></i> ' + gettext('请先选择待删除的系统！')}).showModal();
            return
        }
        dialog({
          title: "<span style='font-size: 15px'>" + gettext("删除确认") + "</span>",
            width: 420,
            fixed: true,
            content: gettext("该操作将删除关联的通道和组件，且不可恢复，是否继续？"),
            ok: function () {
                $.post(UrlMaker.make('system_deleted'), {system_ids: system_ids.join(',')},
                    function(data) {
                        if (!data.error_message) {
                            tmp_msg = ngettext('成功删除 %s 个系统！', '成功删除 %s 个系统！', data.affected_rows);
                            tmp_msg = interpolate(tmp_msg, [data.affected_rows]);
                            dialog({id: 'bktips', lock: true, content: '<i class="bk-icon icon-check2" style="color: green"></i>  ' + tmp_msg}).show();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        } else {
                          dialog({id: 'bktips', lock: true, title: "<span style='font-size: 15px;'>" + gettext("消息") + "</span<>", content: '<i class="bk-icon icon-close2" style="color: red"> ' + data.error_message}).showModal();
                        }
                    }
                );
            },
            cancel: function () {},
            okValue: gettext("确认删除"),
            cancelValue: gettext("取消")
        }).showModal();
    });
});
