/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/*
 * app发布相关
 */
REL_MANAGER = (function(){
  return {
    // 删除app
    app_del: function(obj, app_code){
      var app_del_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/delete/';
      art.dialog({
        title: "删除确认",
        width: 300,
        icon: 'question',
        lock: true,
        content: "<div class='t_s14'>您确定要删除应用“"+app_code+"”吗?</div>",
        ok: function(){
          art.dialog({id: 'bktips',width: 300,icon: 'warning', lock: true,content: '正在进行删除操作，请稍后...'});
          $.post(app_del_url, function(data){
            if(data.result){
              art.dialog({id: 'bktips'}).close();
              window.location.href = BLUEKING.config.paas_host() + 'app/list/';
            }else{
              art.dialog({
                id: 'bktips',
                title: "温馨提示",
                width: 340,
                icon: 'error',
                lock: true,
                content: data.message,
                ok: function(){},
                okVal: "关闭",
              });
            }
          }, 'json');
        },
        cancel: function(){},
        okVal: "确定",
        cancelVal: "取消"
      });
    },
    // 删除 SaaS 应用
    saas_app_del: function(obj, app_code){
      var app_del_url = BLUEKING.config.paas_host() + 'saas/'+app_code+'/delete/';
      art.dialog({
        title: "删除确认",
        width: 300,
        icon: 'question',
        lock: true,
        content: "<div class='t_s14'>您确定要删除应用“"+app_code+"”吗?</div>",
        ok: function(){
          art.dialog({id: 'bktips', width: 300,icon: 'warning', lock: true,content: '正在进行删除操作，请稍后...'});
          $.post(app_del_url, function(data){
            if(data.result){
              art.dialog({id: 'bktips'}).close();
              window.location.href = BLUEKING.config.paas_host() + 'saas/list/';
            }else{
              art.dialog({id: 'bktips'}).close();
              art.dialog({
                id: 'bktips',
                title: "温馨提示",
                width: 340,
                icon: 'error',
                lock: true,
                content: data.message,
                ok: function(){},
                okVal: "关闭",
              });
            }
          }, 'json');
        },
        cancel: function(){},
        okVal: "确定",
        cancelVal: "取消"
      });
    },
    // app提测
    app_test: function(obj, app_code){
      //按钮灰掉
      if ($(obj).hasClass('btn-disabled')){
        return false;
      }

      //组装参数
      var is_use_celery = $("#is_use_celery").attr("checked")
      var is_use_celery_beat = $("#is_use_celery_beat").attr("checked")
      var form_data = {is_use_celery: is_use_celery,
                       is_use_celery_beat: is_use_celery_beat};
      var test_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/test/';
      // 提交测试部署任务
      REL_MANAGER._app_release_task(obj, app_code, test_url, form_data, 1);
    },

    // app上线
    app_online: function(obj, app_code){
      //按钮灰掉
      if ($(obj).hasClass('btn-disabled')){
        return false;
      }

      var tips = $("#is_tips").attr('checked');
      var is_tips = tips ? '1' : '0';
      var features = $('#features').val();
      var bugs = $('#bugs').val();

      //组装参数
      var form_data = {
        'is_tips': is_tips,
        'features': features,
        'bugs': bugs,
      };
      var online_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/online/';
      //上线操作
      REL_MANAGER._app_release_task(obj, app_code, online_url, form_data, 2);
    },
    // app下架
    app_offline: function(obj, app_code){
      //获取表单信息
      var t_check = $("#t_check").attr('checked');
      var o_check = $("#o_check").attr('checked');
      $('#offline_form_error').html('').hide();

      //按钮灰掉
      if ($(obj).hasClass('btn-disabled')){
        return false;
      }

      if(!t_check && !o_check){
        $('#offline_form_error').text('请选择下架环境！').show();
        return false;
      }

      var mode = 'all';
      if(t_check && o_check){
        mode = 'all';
      }else if(t_check){
        mode = 'test';
      }else if(o_check){
        mode = 'prod';
      }
      var form_data = {'mode': mode};
      var offline_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/offline/';
      // 下架操作
      REL_MANAGER._app_release_task(obj, app_code, offline_url, form_data, 3);
    },

    /*
     * 操作任务
     * @param url: 访问的url
     * @param app_code: app编码
     * @param form_data: 参数
     * @param app_state: 1:上线部署，2：测试部署， 3：下架
     */
    _app_release_task: function(obj, app_code, url, form_data, app_state){
      if(app_state== 1){
        $('#release_msg_test').parent().parent().hide();
      }else if(app_state == 2){
        $('#release_msg_pro').parent().parent().hide();
      }else{
        $('#release_msg_offline').parent().parent().hide();
      }

      var tips_msg = '';

      var _env = '';
      if (app_state == 1) {
        _env = '上线部署';
      } else if (app_state == 2){
        _env = '测试部署';
      } else {
        _env = '下架';
      }
      // var _env = app_state==2? '上线': '测试';
      tips_msg = '<div class="ml30"><span style="font-size: 16px;margin-left:30px;"><i class="icon-loading mr10"></i>正在提交' + _env + '请求，请稍后...</div>';

      // 部署流程图显示
      $("#release-flow-before").hide();
      $("#tips_info").html("");
      $("#tips_info").show();
      $("#deploy_input").hide();
      $("#release-flow-before").html(tips_msg);
      $("#release-flow-before").show();

      //部署请求操作
      $.post(url, {
        'form_data': JSON.stringify(form_data)
      },function(data){
        //部署任务提交失败
        if(!data.result){
          REL_MANAGER.back();

          var _operate = '';
          if(app_state == 1){
            _operate = '测试部署';
          }else if(app_state == 2){
            _operate = '上线部署';
          }else{
            _operate = '下架';
          }
          // TODO: maybe show message here
          var msg_bk = "<p><span class='icon forbid'></span><strong class='fail'>" + _operate + "操作执行失败，错误详情：</strong></span>" +"<div class='streamline'> <pre>"+data.message+"</pre></div>";

          if(app_state == 1){
            $('#release_msg_test').html(msg_bk).parent().parent().show();
          }else if(app_state == 2){
            $('#release_msg_pro').html(msg_bk).parent().parent().show();
          }else{
            $('#release_msg_offline').html(msg_bk).parent().parent().show();
          }

          //显示部署操作按钮
          $('button[n_btn=deploy]').parent().find('span[n_m=run]').remove();
          $('button[n_btn=deploy]').show();
          $('button[n_btn=deploy]').removeAttr("disabled");
          // 显示SaaS部署操作按钮
          $('button[n_btn=saas_deploy]').removeAttr("disabled");
        }else if(data.result){
          // 轮询执行结果
          var event_id = data.event_id;
          REL_MANAGER._app_to_poll_task(obj, app_code, data, app_state, form_data);
        }
      }, 'json');
    },
    // 用户确认下架
    confirm_saas_app_offline: function(obj, app_code){
      art.dialog({
            title: "温馨提示",
            width: 340,
            icon: 'warning',
            lock: true,
            content: "<span>您确认下架该应用吗?<br><br>下架后用户将无法访问该应用<br>但应用的数据库依然保留</span>",
            ok: function(){
              var form_data = {'mode': 'prod'};
              var offline_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/offline/';
              $(obj).attr({"disabled":"disabled"});
              REL_MANAGER._app_release_task(obj, app_code, offline_url, form_data, 3);
            },
            okVal: "确认",
            cancelVal: "取消",
            cancel:function(){}
      });
    },
    // 用户确认是否重新部署
    confirm_saas_app_online: function(obj, app_code, saas_app_version_id, app_state){
      // 新创建应用（app_state为空）、state为 0（开发中）、1（已下架）不提示用户,直接部署
      if(!app_state || app_state=='0' || app_state == '1'){
        REL_MANAGER.saas_app_online(obj, app_code, saas_app_version_id);
      }else{
        var cur_file = $('.import-file-name').text();
        var online_file = $('.import-file-name').attr('online_file');
        art.dialog({
            title: "温馨提示",
            width: 400,
            icon: 'warning',
            lock: true,
            content: "<span>您确认重新部署该应用吗?<br><br>线上运行版本："+online_file+"<br>您要部署的版本："+cur_file+"</span>",
            ok: function(){
              REL_MANAGER.saas_app_online(obj, app_code, saas_app_version_id);
            },
            okVal: "确认",
            cancelVal: "取消",
            cancel:function(){}
        });
      }
    },
    // 部署saas 应用
    saas_app_online: function(obj, app_code, saas_app_version_id){
      //按钮灰掉
      $(obj).attr({"disabled":"disabled"})
      var saaa_online_url = BLUEKING.config.paas_host() + 'saas/'+app_code+'/release/online/'+saas_app_version_id+'/';

      tips_msg = '<div class="ml30"><span style="font-size: 16px;margin-left:30px;"><i class="icon-loading mr10"></i>正在提交部署请求，请稍后...</div>';

      // 部署流程图显示
      $("#release-flow-before").hide();
      $("#tips_info").html("");
      $("#tips_info").show();
      $("#deploy_input").hide();
      $("#release-flow-before").html(tips_msg);
      $("#release-flow-before").show();
      $('#release_msg_pro').parent().parent().hide();
      //部署请求操作
      $.post(saaa_online_url, function(data){
        //部署任务提交失败
        if(!data.result){
          REL_MANAGER.back();

          var msg_bk = "<p><span class='icon forbid'></span><strong class='fail'>部署操作执行失败，错误详情：</strong></span>" +"<div class='streamline'> <pre>"+data.message+"</pre></div>";
          $('#release_msg_pro').html(msg_bk).parent().parent().show();
          //显示部署操作按钮
          $('#saas_app_online').removeAttr("disabled");
        }else if(data.result){
          // 轮询执行结果
          var event_id = data.event_id;
          var app_code = data.app_code;
          REL_MANAGER._app_to_poll_task(obj, app_code, data, 2, {});
        }
      }, 'json');
    },
    /*
     * 任务轮询
     * @param app_code: app编码
     * @param data_operate: 操作数据
     * @param operate_type: 操作类型
     * @param app_state: app操作状态，0：删除，1：提测，2：上线，3：下架
     */
    _app_to_poll_task: function(obj, app_code, data_operate, app_state, form_data){
      var poll_url = '';

      poll_url = BLUEKING.config.paas_host() + 'release/'+app_code+'/task/';
      // 获取提测轮询任务数据
      $.get(poll_url, {
        'event_id': data_operate.event_id,
        'app_state': app_state
      }, function(resp){

        data = resp.data
        html_data = data.html;

        // 展示过程流程图
        // $("#release-flow").html(data.data);
        $("#release-flow").html(html_data);
        if($("#release-flow-before").is(":hidden") === false){
          $("#release-flow-before").hide();
        }
        if($("#release-flow").is(":hidden")){
          $("#release-flow").show();
        }

        if(data.status === 0){ //失败
          REL_MANAGER._app_operate_fail(obj, app_code, data, app_state, form_data);
        }else if(data.status == 1){//成功
          REL_MANAGER._app_operate_success(obj, app_code, data, app_state, form_data);
        }else{//轮询
          window.setTimeout(function(){REL_MANAGER._app_to_poll_task(obj, app_code, data_operate, app_state, form_data)}, 2*1000);
        }
      }, 'json');
    },

    /*
     * 执行失败
     */
    _app_operate_fail: function(obj, app_code, data, app_state, form_data){
      // 暂时不需要这个效果
      // var msg_bk = '';
      // console.log(app_state);
      // if(app_state == 1){
        // msg_bk = "<div class='mt5' style='font-size:14px;padding:5px;background-color:#FFF;;font-family:Microsoft YaHei'><span class='icon forbid'></span>测试部署操作执行失败，请查看详细错误信息：<br/></div>";
      // }else if(app_state == 2){
        // msg_bk = "<div class='mt5' style='font-size:14px;padding:5px;background-color:#FFF;;font-family:Microsoft YaHei'><span class='icon forbid'></span>上线部署操作执行失败，请查看详细错误信息：<br/></div>";
      // }else{
        // msg_bk = "<pre class='mt5' style='font-size:14px;padding:5px;background-color:#FFF;;font-family:Microsoft YaHei'><span class='icon forbid'></span>下架操作执行失败，请查看详细错误信息：<br/>"+data.message+"</pre>";
      // }
      // $('.appstate').html('');
      // $('button[n_btn=deploy]').removeClass('disabled');
      // $("#tips_info").html(msg_bk);
      // SaaS应用部署失败，可重新操作
      $('button[n_btn=saas_deploy]').removeClass('disabled');
      $('button[n_btn=saas_deploy]').removeAttr('disabled');
    },

    /*
     * 执行成功
     * @param app_code: app编码
     * @param data: 返回数据
     * @param app_state: 操作状态,1： 测试，2：上线
     * @param form_data: 表单数据
     */
    _app_operate_success: function(obj, app_code, data, app_state, form_data){
      $("#deploy_apply div[apply]").hide();
      $('#error_dev').html('');
      $('#app_del').remove();

      REL_MANAGER.refresh_app_state(obj, app_state, data, form_data);
      //刷新快捷入口信息
      BASE_APP.refresh_app_status(app_code);

      // 特性信息填写
      $('textarea[name=features], textarea[name=bugs]').val('');
      $('#is_tips').removeAttr('checked');

      //提测操作成功提示
      $('.appstate').html('');
      $('button[n_btn=deploy]').removeClass('disabled');
      $('button[n_btn=deploy]').removeAttr('disabled');

      //其他操作状态修改
      if(app_state == 1){ //测试
        REL_MANAGER._modify_online_state('show');
        // 下架操作打开
        REL_MANAGER._modify_offline_state('show');
      } else if(app_state == 2){//上线

        REL_MANAGER._modify_online_state('hide', false, '<span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>应用已上线，请重新测试部署后，再执行正式部署操作！');
        REL_MANAGER._modify_offline_state('show');

      } else {//下架
        // 下架成功切换按钮和选项状态
        var mode = form_data.mode;
        var t_check = $("#t_check");
        var o_check = $("#o_check");
        if (mode == 'all') {
          t_check.attr("checked", false);
          t_check.attr("disabled", true);

          o_check.attr("checked", false);
          o_check.attr("disabled", true);

        } else if (mode == 'test') {
          t_check.attr("checked", false);
          t_check.attr("disabled", true);

        } else if (mode == 'prod') {
          o_check.attr("checked", false);
          o_check.attr("disabled", true);
        }
        if (t_check.attr("disabled") && o_check.attr("disabled")) {
          $(obj).addClass('btn-disabled');
          REL_MANAGER._modify_offline_state('hide');
        }

        if(mode == 'all' || mode == 'prod'){
          REL_MANAGER._modify_online_state('hide', false, '<span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>应用已下架，请您重新测试部署后，再进行正式部署操作！');
        }else{
          //测试环境下架 可以进行正式部署
        }

      }
    },

    _modify_online_state: function(state, is_show_tab, msg){
      //上线状态栏关闭
      if(state == 'hide'){
        if(!is_show_tab){
          $('#deploy_tab li[data-id=online_form]').addClass('disabled_status');
          $('#deploy_tab li[data-id=online_form] span').show();
          $('#deploy_tab li[data-id=online_form] a').attr('title', '请重新测试部署后，再进行正式部署！');
        }
        //上线操作按钮禁止
        $("#app_online, #create_new_ver").addClass('disabled');
        $("#app_online").removeAttr('id');
        $("#create_new_ver").removeAttr('id');
        $("#online_form_error").html(msg).show();
      }else if(state == 'show'){
        $('#deploy_tab li[data-id=online_form]').removeClass('disabled_status');
        $('#deploy_tab li[data-id=online_form] a').removeAttr('title');
        $('#deploy_tab li[data-id=online_form] span').hide();
      }
    },

    _modify_offline_state: function(state){
      //下架栏操作打开
      if (state == 'show'){
        $('#deploy_tab li[data-id=offline_form]').removeClass('disabled_status');
        $('#deploy_tab li[data-id=offline_form] a').removeAttr('title');
        $('#deploy_tab li[data-id=offline_form] span').hide();
      } else if (state == 'hide') {
        $('#deploy_tab li[data-id=offline_form]').addClass('disabled_status');
        $('#deploy_tab li[data-id=offline_form] a').attr('title', '请测试部署后，再进行正式部署');
        $('#deploy_tab li[data-id=offline_form] span').show();
      }
    },

    //修改app的环境状态
    refresh_app_state: function(obj, app_state, data, form_data){
      if (app_state == 1){
        $('#test_state').html(
          '<a href="'+data.app_test_url+'" target="_blank">' +'<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>马上访问' +'</a>'
        );
        $('span[name_state=test]').text('正在运行').removeClass('status_normal').addClass('status_success');
      }else if(app_state == 2){
        $('#pro_state').html(
          '<a href="'+data.app_prod_url+'" target="_blank">' +'<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>马上访问' +'</a>'
        );
        $('span[name_state=pro]').text('正在运行').removeClass('status_normal').addClass('status_success');
      }else{
        var env = form_data.mode;
        var _prod_state_html = '<span class="glyphicon glyphicon-chevron-right ml40" style="color:#999;" data-toggle="tooltip" data-placement="right" title="应用未进行上线部署或者已经下架，访问入口关闭！"></span>' +'马上访问';
        var _test_state_html = '<span class="glyphicon glyphicon-chevron-right ml40" style="color:#999;" data-toggle="tooltip" data-placement="right" title="应用未进行测试部署或者已经下架，访问入口关闭！"></span>' +'马上访问';
        if (env == 'test' || env == 'all'){
          $('#test_state').html(_test_state_html);
          $('span[name_state=test]').text('已下架').removeClass('status_success').addClass('status_normal');
        }
        if (env == 'prod' || env == 'all'){
          $('#pro_state').html(_prod_state_html);
          $('span[name_state=pro]').text('已下架').removeClass('status_success').addClass('status_normal');
        }
      }
    },

    back: function() {
      $("#release-flow-before").hide();
      $("#release-flow").hide();
      $("#detail_log").hide();
      $("#detail_button").hide();
      $("#detail_click").html("点击查看详情");
      $("#tips_info").hide();
      $("#deploy_input").show();
    },
    // 返回到SaaS应用列表页面
    back_saas: function(){
      window.location.href = BLUEKING.config.paas_host() + 'saas/list/';
    },
    get_app_release_detail: function() {
      if($("#detail_log").is(":hidden")){
        $("#detail_log").show();
        var scrollTop = $("#detail_info")[0].scrollHeight;
        $("#detail_info").scrollTop(scrollTop);
        $("#detail_click").html("点击隐藏详情");
      }else{
        $("#detail_log").hide();
        $("#detail_click").html("点击查看详情");
      }
    },

    // 发布部署 - 部署操作tab, 更新
    refresh_roll: function(app_code, app_state, msg_id, show_tip, type) {
      var url = BLUEKING.config.paas_host() + 'release/'+app_code+'/record/last_release/';

      $.get(url,{},function(resp){
        if(resp.result){
          // $(msg_id).parent().parent().hide();
          // var tips_msg = "<span n_m='run' class='mr5'><i class='icon-loading mr5'></i>正在执行" + show_tip + "部署操作，请稍候...</span>";
          // //隐藏部署按钮，显示正在执行状态
          // $('button[n_btn=deploy]').parent().append(tips_msg);
          // $('button[n_btn=deploy]').hide();

          data = resp.data;
          // get flow div show
          REL_MANAGER._app_to_poll_task(null, app_code, data, type, {});
        }
      }, 'json');
    },

    // 发布部署 - 部署操作的tab展示
    deploy_tab_show: function(obj, first_load, app_code, app_state, msg_id, show_tip, type, static_url) {
      var first = first_load;
      if(obj.hasClass('disabled_status')){
        //不做处理
      }else{
        var formId = obj.attr('data-id');
        var url = BLUEKING.config.paas_host() + 'release/' + app_code +'/deploy_page/'+formId+'/';
        $('#' + formId).html('<div style="text-align: center;margin-top:50px;opacity:0.2;filter:alpha(opacity=20);"><img src="' + static_url + 'img/base/icon32_loading_light1e5b3a.gif"></div>');
        $.get(url, function(data){
          $('#' + formId).html(data);

          if (app_state == 8 || app_state == 9 || app_state == 10) {
            if(first){
              // NOTE: hidden here
              $("#release-flow-before").hide();
              $("#tips_info").html("");
              // $("#tips_info").show();
              $("#deploy_input").hide();
              // $("#release-flow-before").show();

              REL_MANAGER.refresh_roll(app_code, app_state, msg_id, show_tip, type);
            }
          }

        });

        $('#deploy_tab').find('.active').removeClass('active');
        obj.addClass('active');

        $('.deploy_content').find('div[n_form]').hide();
        $('#' + formId).show();
      }
      return first;
    },

    // 版本记录搜索
    search_app_record: function(app_code, operate_id){
      var url = BLUEKING.config.paas_host() + 'release/' + app_code + '/record/list/'+operate_id+'/';
      $.get(url, function(data){
        $('#record_list').html(data);
      });
    },


    // 发布记录 - 点击展示详情
    pub_record_show: function(obj){
      var tr_obj = obj.next('tr');
      if (tr_obj.attr('class') == 'detail'){
        // 显示、隐藏组件内容
        var is_hiden = $(tr_obj).is(":hidden");
        var icon_obj = obj.find('i');
        if(is_hiden){
          obj.next('tr').css('display', '');
          icon_obj.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        }else{
          obj.next('tr').css('display', 'none');
          icon_obj.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        }
      }
    },

    // 查询未完成任务的状态, 更新数据库
    check_unfinished_task: function(app_code) {
      var url = BLUEKING.config.paas_host() + 'release/' + app_code + '/task/unfinished/';
      $.get(url, function(data){
      });
    },


    // 使用/取消celery/celery_beat
    check_use_celery: function(is_checked) {
			if(!is_checked){
				//提示
				art.dialog({
							    title: "温馨提示",
							    width: 340,
							    icon: 'warning',
							    lock: true,
							    content: "<font style='color:red;'>您确认该应用没有使用celery吗？取消celery部署后，应用相关celery功能将不能使用！</font>",
							    ok: function(){
							    	$('#is_use_celery_beat').removeAttr('checked');
							    },
							    okVal: "确认",
							    cancelVal: "关闭",
							    cancel:function(){
							    	$('#is_use_celery').attr('checked', 'checked');
							    }
							});
			}
    },

    check_use_celery_beat: function(is_checked) {
			if(is_checked){
				$('#is_use_celery').attr('checked', 'checked');
			}else{
				art.dialog({
							    title: "温馨提示",
							    width: 340,
							    icon: 'warning',
							    lock: true,
							    content: "<font style='color:red;'>取消“周期性任务”部署，已有周期性任务执行将会失效！您确认取消“周期性任务”部署吗？</font>",
							    ok: function(){},
							    okVal: "确认",
							    cancelVal: "关闭",
							    cancel:function(){
							    	$('#is_use_celery_beat').attr('checked', 'checked');
							    }
							});
			}
    }

  };
})();
