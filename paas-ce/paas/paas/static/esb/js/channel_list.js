/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function() {
    $('.mymodal-backdrop').bind('click', function () {
        $('body').removeClass('menu-active');
        $('.dropdown .dropdown-content').hide();
    });
    $('#search_channel_system').select2();

    function clearSelection() {
        var sel;
        if ( (sel = document.selection) && sel.empty ) {
            sel.empty();
        } else {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            var activeEl = document.activeElement;
            if (activeEl) {
                var tagName = activeEl.nodeName.toLowerCase();
                if ( tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text") ) {
                    // Collapse the selection to the end
                    activeEl.selectionStart = activeEl.selectionEnd;
                }
            }
        }
    }
    var channels_manager = {
        get_selected_channel_ids: function() {
            var result = []
            $('input[name="channel_id"]:checked').each(function(i, j){
                result.push($(j).val());
            });
            return result;
        }
    };

    // 为删除按钮绑定事件
    $('#channels_delete').bind('click', function(){
        channel_ids = channels_manager.get_selected_channel_ids();
        if (channel_ids.length === 0) {
            dialog({id: 'bktips', lock: true, title: '<span style="font-size: 15px;">'+gettext('消息')+'</span>', content: '<i class="bk-icon icon-close2" style="color: red"></i> ' + gettext('请先选择待删除的通道！')}).showModal();
            return
        }

        dialog({
          title: "<span style='font-size:15px;'>"+gettext("删除确认")+"</span>",
            width: 300,
            fixed: true,
            content: gettext("该操作不可恢复，是否继续？"),
            ok: function () {
                $.post(
                    UrlMaker.make('channel_deleted'),
                    {
                        channel_ids: channel_ids.join(','),
                    },
                    function(data) {
                        if (!data.error_message) {
                            tmp_msg = ngettext('成功删除 %s 个通道！', '成功删除 %s 个通道！', data.affected_rows);
                            tmp_msg = interpolate(tmp_msg, [data.affected_rows]);
                            dialog({id: 'bktips', fixed: true, content: '<i class="bk-icon icon-check2" style="color: green"></i>  ' + tmp_msg}).show();
                            setTimeout(function(){
                              window.location.reload();
                            }, 2000)
                        } else {
                            dialog({id: 'bktips', fixed: true, title: "<span style='font-size:15px;'>"+gettext("消息")+"</span>", content: '<i class="bk-icon icon-close2" style="color: red"></i> ' + data.error_message}).showModal();
                        }
                    }
                );
            },
            cancel: function () {},
            okValue: gettext("确认删除"),
            cancelValue: gettext("取消")
        }).showModal();
    });

    // 为查询按钮绑定事件
    Handlebars.registerHelper("channel_edit_url", function(value) {
        return UrlMaker.make('channel_edit', {'channel_id': value});
    });

    var PageConf = Backbone.Model.extend();
    var SearchConf = new PageConf();

    function get_search_conf() {
        return {
            'system_name': $('#search_channel_system').val(),
            'channel_path': $('#search_channel_path').val(),
            'channel_name': $('#search_channel_name').val(),
        }
    }

    var MainView = Backbone.View.extend({
        el: 'body',
        template: Handlebars.compile($('#tmpl_channel_list').html()),
        events: {
            'click #search_channel_btn': function(ev) {
                SearchConf.set(get_search_conf());
            },
            'click .show_esb_url': function(ev) {
                $('body').addClass('menu-active');
                $('#' + ev.target.id).parent('.dropdown').find('.dropdown-content').show();
            },
            'click .copy-to-clipboard': function(ev) {
                var btn = ev.currentTarget;
                var input = $(btn).parent().prev();
                var el_tooltip = $(btn).parent().find('.tooltip-inner');

                input[0].select();
                try {
                    document.execCommand("copy");
                    el_tooltip.text(gettext('已复制'));
                } catch(err) {
                    el_tooltip.text(gettext('复制失败，请手动复制'));
                }
                clearSelection();
            },
            'change input[name="channel_id"]': function(ev) {
                // 绑定checkbox修改事件
                target = $(ev.target);
                if (target.is(':checked')) {
                    target.parents('tr').addClass('row-selected');
                } else {
                    target.parents('tr').removeClass('row-selected');
                }
            }
        },
        initialize: function() {
            this.listenTo(SearchConf, 'change', this.render);
        },
        render: function() {
            var tmpl = this.template;
            $.getJSON(
                UrlMaker.make('channel_list'),
                {
                    system_name: SearchConf.get('system_name'),
                    channel_path: SearchConf.get('channel_path'),
                    channel_name: SearchConf.get('channel_name'),
                },
                function(data) {
                    $('#table_channels').html(tmpl(data));

                    $('[data-toggle="tooltip"]').tooltip();
                }
            )
        }
    });

    var EMainView = new MainView();
    SearchConf.set(get_search_conf());
    SearchConf.trigger('change');
});
