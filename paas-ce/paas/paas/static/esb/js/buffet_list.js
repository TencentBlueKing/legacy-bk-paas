/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('.show_esb_url').bind('click', function () {
        $('body').addClass('menu-active');
        $('#'+this.id).parent('.dropdown').find('.dropdown-content').show();
    });
    $('.mymodal-backdrop').bind('click', function () {
        $('body').removeClass('menu-active');
        $('.dropdown .dropdown-content').hide();
    });
    $('.copy-to-clipboard').bind('click', function (ev) {
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
    });
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
});
