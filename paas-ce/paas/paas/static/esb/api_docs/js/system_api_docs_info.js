/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
// system info render

$(function () {
    var ContentView = Backbone.View.extend({
        el: '#system_api_info',
        feedback_default_template: Handlebars.compile($('#tmpl-feedback-default').html()),
        feedback_content_template: Handlebars.compile($('#tmpl-feedback-content').html()),
        events: {
            'click #system_desc': function () {
                this.init_desc_content();
            },
            'click .sub-menu a': 'render_right_content',
            'click #question': function () {
                $("#user_feedback").empty().html(this.feedback_content_template());
            },
            'click #cancel': function () {
                $("#user_feedback").empty().html(this.feedback_default_template());
            },
            'click #submit': 'submit_the_advice',
            'click #ok': 'submit_the_advice',
        },
        initialize: function (ev) {
            this.init_left_nav();
            this.render_right_content();
        },
        init_left_nav: function (ev) {
            var menu = $('.has_submenu>a').parent("li");
            var sunMenu = $('.has_submenu>a').next("ul");
            $(".navi > li > ul").slideUp(350);
            setTimeout(function(){
                $(".navi > li").removeClass("open");
                sunMenu.slideDown(350);
                menu.addClass("open");
            },350);
            $(".has_submenu > a").click(function(e) {
                var menu = $(this).parent("li");
                var sunMenu = $(this).next("ul");
                if (menu.hasClass("open")) {
                    sunMenu.slideUp(350,function(){
                        menu.removeClass("open");
                    });
                } else {
                    $(".navi > li > ul").slideUp(350);
                    setTimeout(function(){
                        $(".navi > li").removeClass("open");
                        sunMenu.slideDown(350);
                        menu.addClass("open");
                    },350);
                }
                return false;
            });
        },
        render_right_content: function (ev) {
            //处理面包屑
            var name = $('.a-active-style').attr('name');
            if(name!='desc'){
                $("#curr_breadcrumb").empty().html(gettext('API列表') + ' > '+name);
                this.init_doc_content()
            }else{
                $("#curr_breadcrumb").empty().html('简介');
            }
        },
        init_doc_content: function (ev) {
            $.get(docs_content_url, function (data) {
                $('#api_docs').empty().html(data['doc_html'] || gettext('暂无文档，请联系 API 负责人处理'));
            });
            $("#user_feedback").empty().html(this.feedback_default_template());
        },
        submit_the_advice: function (ev) {
            var data = {
                'api_id': api_id,
                'system_name': system_name,
                'component_name': component_name,
                'content': $('textarea').val()
            }
            $.post(submit_url, data, function (data) {
                if(data['result']){
                    $("#user_feedback").empty().html(gettext("感谢您的反馈！"));
                }
            })
        }
    });

    window.content_view = new ContentView();
});
