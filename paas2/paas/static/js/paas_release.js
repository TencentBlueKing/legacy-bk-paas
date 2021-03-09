/*
 * app发布相关
 */
REL_MANAGER = (function(){
  return {
    // 通用删除应用方法
    base_app_del: function(obj, app_code, del_url, redict_url){
      art.dialog({
        title: gettext("删除确认"),
        width: 300,
        icon: 'question',
        lock: true,
        content: "<div class='t_s14'>"+gettext("您确定要删除应用")+"“"+app_code+"”?</div>",
        ok: function(){
          // art.dialog({id: 'bktips',width: 300,icon: 'warning', lock: true,content: gettext('正在进行删除操作，请稍后...')});
          $.post(del_url, function(data){
            if(data.result){
              art.dialog({id: 'bktips'}).close();
              window.location.href = redict_url;
            }else{
              art.dialog({
                id: 'bktips',
                title: gettext("温馨提示"),
                width: 340,
                icon: 'error',
                lock: true,
                content: data.msg,
                ok: function(){},
                okVal: gettext("关闭"),
              });
            }
          }, 'json');
        },
        cancel: function(){},
        okVal: gettext("确定"),
        cancelVal: gettext("取消")
      });
    },
    // 删除app
    app_del: function(obj, app_code){
      var app_del_url = BLUEKING.config.paas_host() + 'release/delete/'+app_code+'/';
      var redict_url = BLUEKING.config.paas_host() + 'app/list/';
      REL_MANAGER.base_app_del(obj, app_code, app_del_url, redict_url);
    },
    // 删除 SaaS 应用
    saas_app_del: function(obj, app_code){
      var app_del_url = BLUEKING.config.paas_host() + 'saas/delete/'+app_code+'/';
      var redict_url = BLUEKING.config.paas_host() + 'saas/list/';
      REL_MANAGER.base_app_del(obj, app_code, app_del_url, redict_url);
    },
    // 删除集成应用（第三方应用）
    tpapp_del: function(obj, app_code){
      var app_del_url = BLUEKING.config.paas_host() + 'release/delete/'+app_code+'/';
      var redict_url = BLUEKING.config.paas_host() + 'tpapp/list/';
      REL_MANAGER.base_app_del(obj, app_code, app_del_url, redict_url);
    },
    // app提测
    app_test: function(obj, app_code){
      //按钮灰掉
      if ($(obj).hasClass('btn-disabled')){
        return false;
      }

      var checkout_target = $("#checkout_target").val()
      if (checkout_target !== undefined && checkout_target.length < 1) {
        art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: true,content: gettext("部署分支/Tag不能为空")}).time(2);
        return false;
      }

      //组装参数
      var is_use_celery = $("#is_use_celery").attr("checked")
      var is_use_celery_beat = $("#is_use_celery_beat").attr("checked")
      var form_data = {is_use_celery: is_use_celery,
                       is_use_celery_beat: is_use_celery_beat,
                       checkout_target: checkout_target};
      var test_url = BLUEKING.config.paas_host() + 'release/test/'+app_code+'/';
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

      // get servers
      var checked_servers = [];
      $.each($("input[name='servers']:checked"), function(){
          checked_servers.push($(this).val());
      });

      if (checked_servers.length < 1) {
        art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: true,content: gettext("请至少选择一台服务器")}).time(2);
        return false;
      }
      var servers = checked_servers.join(",")

      // 组装参数
      var form_data = {
        'is_tips': is_tips,
        'features': features,
        'bugs': bugs,
        'servers': servers,
      };
      var online_url = BLUEKING.config.paas_host() + 'release/online/'+app_code+'/';
      //上线操作
      REL_MANAGER._app_release_task(obj, app_code, online_url, form_data, 2);
    },
    // app下架
    app_outline: function(obj, app_code){
      //获取表单信息
      var t_check = $("#t_check").attr('checked');
      var o_check = $("#o_check").attr('checked');
      $('#outline_form_error').html('').hide();

      //按钮灰掉
      if ($(obj).hasClass('btn-disabled')){
        return false;
      }

      if(!t_check && !o_check){
        $('#outline_form_error').text(gettext('请选择下架环境！')).show();
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
      var outline_url = BLUEKING.config.paas_host() + 'release/outline/'+app_code+'/';
      // 下架操作
      REL_MANAGER._app_release_task(obj, app_code, outline_url, form_data, 3);
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
        $('#release_msg_outline').parent().parent().hide();
      }

      var tips_msg = '';

      var _env = '';
      if (app_state == 1) {
        _env = gettext('上线部署');
      } else if (app_state == 2){
        _env = gettext('测试部署');
      } else {
        _env = gettext('下架');
      }
      // var _env = app_state==2? '上线': '测试';
      tips_msg = '<div class="ml30"><span style="font-size: 16px;margin-left:30px;"><i class="icon-loading mr10"></i>'+gettext('正在提交' )+ _env + gettext('请求，请稍后...')+'</div>';

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
            _operate = gettext('测试部署');
          }else if(app_state == 2){
            _operate = gettext('上线部署');
          }else{
            _operate = gettext('下架');
          }
          // TODO: maybe show message here
          var msg_bk = "<p><span class='icon forbid'></span><strong class='fail'>" + _operate + gettext("操作执行失败，错误详情：")+"</strong></span>" +"<div class='streamline'> <pre>"+data.msg+"</pre></div>";

          if(app_state == 1){
            $('#release_msg_test').html(msg_bk).parent().parent().show();
          }else if(app_state == 2){
            $('#release_msg_pro').html(msg_bk).parent().parent().show();
          }else{
            $('#release_msg_outline').html(msg_bk).parent().parent().show();
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
    confirm_saas_app_offline: function(obj, app_code, mode){
      art.dialog({
            title: gettext("温馨提示"),
            width: 340,
            icon: 'warning',
            lock: true,
            content: gettext("<span>您确认下架该应用吗?<br><br>下架后用户将无法访问该应用<br>但应用的数据库依然保留</span>"),
            ok: function(){
              var form_data = {'mode': mode};
              var outline_url = BLUEKING.config.paas_host() + 'release/outline/'+app_code+'/';
              $(obj).attr({"disabled":"disabled"});
              REL_MANAGER._app_release_task(obj, app_code, outline_url, form_data, 3);
            },
            okVal: gettext("确认"),
            cancelVal: gettext("取消"),
            cancel:function(){}
      });
    },
    // 用户确认是否重新部署
    confirm_saas_app_online: function(obj, saas_app_version_id, app_state, mode, servers){
      // 新创建应用（app_state为空）、state为 0（开发中）、1（已下架）不提示用户,直接部署
      if(!app_state || app_state=='0' || app_state == '1'){
        REL_MANAGER.saas_app_online(obj, saas_app_version_id, mode, servers);
      }else{

        var cur_file = $('#version_info').attr('current_version');
        var online_file = $('#version_info').attr('online_version');

        art.dialog({
            title: gettext("温馨提示"),
            width: 400,
            icon: 'warning',
            lock: true,
            content: gettext("<span>您确认重新部署该应用吗?<br><br>当前环境运行版本：")+online_file+gettext("<br>您要部署的版本：")+cur_file+"</span>",
            ok: function(){
              REL_MANAGER.saas_app_online(obj, saas_app_version_id, mode, servers);
            },
            okVal: gettext("确认"),
            cancelVal: gettext("取消"),
            cancel:function(){}
        });
      }
    },
    // 部署saas 应用
    saas_app_online: function(obj, saas_app_version_id, mode, servers){
      //按钮灰掉
      $(obj).attr({"disabled":"disabled"})
      var saaa_online_url = BLUEKING.config.paas_host() + 'saas/release/online/'+saas_app_version_id+'/';

      tips_msg = '<div class="ml30"><span style="font-size: 16px;margin-left:30px;"><i class="icon-loading mr10"></i>'+gettext('正在提交部署请求，请稍后...')+'</div>';

      // 部署流程图显示
      $("#release-flow-before").hide();
      $("#tips_info").html("");
      $("#tips_info").show();
      $("#deploy_input").hide();
      $("#release-flow-before").html(tips_msg);
      $("#release-flow-before").show();
      $('#release_msg_pro').parent().parent().hide();
      //部署请求操作
      $.post(saaa_online_url, {"mode": mode, "servers": servers},
        function(data){
        //部署任务提交失败
        if(!data.result){
          REL_MANAGER.back();

          var msg_bk = "<p><span class='icon forbid'></span><strong class='fail'>"+gettext("部署操作执行失败，错误详情：")+"</strong></span>" +"<div class='streamline'> <pre>"+data.msg+"</pre></div>";
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
    // 部署/下架 集成应用（第三方应用）
    tpapp_release_task: function(obj, app_code, mode, static_url){
      var operation_name = '';
      if(mode == 'online'){
        operation_name = gettext('部署');
      }else if(mode == 'offline'){
        operation_name = gettext('下架');
      }else{
        return false;
      }
      //按钮灰掉
      $(obj).attr({"disabled":"disabled"});
      $("#release_tips").html('<img alt="loadding" src="'+static_url+'img/loading_2_24x24.gif" style="width: 16px;height: 16px;"><span class="ml5">'+gettext('正在')+operation_name+gettext('中，请耐心等待</span>'));
      var tpapp_release_url = BLUEKING.config.paas_host() + 'tpapp/release/task_excute/'+app_code+'/';
      // 部署请求
      $.post(tpapp_release_url, {'mode': mode}, function(data){
        if(data.result){
          $("#release_tips").html('<span class="glyphicon glyphicon-ok-circle" aria-hidden="true" style="color: #5cb85c;"></span><span class="ml5">'+operation_name+gettext('成功')+'</span>');
          BASE_APP.refresh_tpapp_status(app_code);
        }else{
          $("#release_tips").html('<span class="glyphicon glyphicon-remove-circle" aria-hidden="true" style="color: red"></span><span class="ml5">'+operation_name+gettext('失败，原因')+'：'+data.message+'</span>');
          $(obj).removeAttr("disabled");
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

      poll_url = BLUEKING.config.paas_host() + 'release/get_app_poll_task/'+app_code+'/';
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
          //window.setTimeout(function(){REL_MANAGER._app_to_poll_task(obj, app_code, data_operate, app_state, form_data)}, 2*1000);
          REL_MANAGER.start_or_stop_loop(1, obj, app_code, data_operate, app_state, form_data);
        }
      }, 'json');
    },
    start_or_stop_loop: function(is_start, obj, app_code, data_operate, app_state, form_data) {
      console.log("calling:" + is_start)
      if(is_start == 1) {
        loop_event = window.setTimeout(function(){REL_MANAGER._app_to_poll_task(obj, app_code, data_operate, app_state, form_data)}, 2*1000);
        console.log(loop_event)
      } else {
        if(typeof loop_event != 'undefined'){
          clearTimeout(loop_event)
          console.log(loop_event)
        }
      }
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
        // msg_bk = "<pre class='mt5' style='font-size:14px;padding:5px;background-color:#FFF;;font-family:Microsoft YaHei'><span class='icon forbid'></span>下架操作执行失败，请查看详细错误信息：<br/>"+data.msg+"</pre>";
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
        REL_MANAGER._modify_outline_state('show');
      } else if(app_state == 2){//上线

        REL_MANAGER._modify_online_state('hide', false, '<span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>'+gettext('应用已上线，请重新测试部署后，再执行正式部署操作！'));
        REL_MANAGER._modify_outline_state('show');

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
          REL_MANAGER._modify_outline_state('hide');
        }

        if(mode == 'all' || mode == 'prod'){
          REL_MANAGER._modify_online_state('hide', false, '<span aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>'+gettext('应用已下架，请您重新测试部署后，再进行正式部署操作！'));
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
          $('#deploy_tab li[data-id=online_form] a').attr('title', gettext('请重新测试部署后，再进行正式部署！'));
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

    _modify_outline_state: function(state){
      //下架栏操作打开
      if (state == 'show'){
        $('#deploy_tab li[data-id=outline_form]').removeClass('disabled_status');
        $('#deploy_tab li[data-id=outline_form] a').removeAttr('title');
        $('#deploy_tab li[data-id=outline_form] span').hide();
      } else if (state == 'hide') {
        $('#deploy_tab li[data-id=outline_form]').addClass('disabled_status');
        $('#deploy_tab li[data-id=outline_form] a').attr('title', gettext('请测试部署后，再进行正式部署'));
        $('#deploy_tab li[data-id=outline_form] span').show();
      }
    },

    //修改app的环境状态
    refresh_app_state: function(obj, app_state, data, form_data){
      if (app_state == 1){
        $('#test_state').html(
          '<a href="'+data.app_test_url+'" target="_blank">' +'<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>'+gettext('马上访问' )+'</a>'
        );
        $('span[name_state=test]').text(gettext('正在运行')).removeClass('status_normal').addClass('status_success');
      }else if(app_state == 2){
        $('#pro_state').html(
          '<a href="'+data.app_prod_url+'" target="_blank">' +'<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>'+gettext('马上访问')+'</a>'
        );
        $('span[name_state=pro]').text(gettext('正在运行')).removeClass('status_normal').addClass('status_success');
      }else{
        var env = form_data.mode;
        var _prod_state_html = '<span class="glyphicon glyphicon-chevron-right ml40" style="color:#999;" data-toggle="tooltip" data-placement="right" title="'+gettext('应用未进行上线部署或者已经下架，访问入口关闭！')+'"></span>' +gettext('马上访问');
        var _test_state_html = '<span class="glyphicon glyphicon-chevron-right ml40" style="color:#999;" data-toggle="tooltip" data-placement="right" title="'+gettext('应用未进行测试部署或者已经下架，访问入口关闭！')+'"></span>' +gettext('马上访问');
        if (env == 'test' || env == 'all'){
          $('#test_state').html(_test_state_html);
          $('span[name_state=test]').text(gettext('已下架')).removeClass('status_success').addClass('status_normal');
        }
        if (env == 'prod' || env == 'all'){
          $('#pro_state').html(_prod_state_html);
          $('span[name_state=pro]').text(gettext('已下架')).removeClass('status_success').addClass('status_normal');
        }
      }
    },

    back: function() {
      $("#release-flow-before").hide();
      $("#release-flow").hide();
      $("#detail_log").hide();
      $("#detail_button").hide();
      $("#detail_click").html(gettext("点击查看详情"));
      $("#tips_info").hide();
      $("#deploy_input").show();
    },
    // 返回到SaaS应用列表页面
    back_saas: function(app_code, back_to, mode){
      var tab = "0";
      if (mode == "prod") {
        tab = "1";
      }
      if (back_to == "online") {
        window.location.href = BLUEKING.config.paas_host() + 'saas/release/online/' + app_code + '/?tab=' + tab;
      } else {
        window.location.href = BLUEKING.config.paas_host() + 'saas/release/offline/' + app_code + '/?tab=' + tab;
      }
      // $("#release-flow-before").hide();
      // $("#release-flow").hide();
      // $("#detail_log").hide();
      // $("#detail_button").hide();
      // $("#detail_click").html("点击查看详情");
      // $("#tips_info").hide();
      // $("#deploy_input").show();
      // //显示部署操作按钮
      // $('#saas_app_online').removeAttr("disabled");
    },
    get_app_release_detail: function() {
      if($("#detail_log").is(":hidden")){
        $("#detail_log").show();
        var scrollTop = $("#detail_info")[0].scrollHeight;
        $("#detail_info").scrollTop(scrollTop);
        $("#detail_click").html(gettext("点击隐藏详情"));
      }else{
        $("#detail_log").hide();
        $("#detail_click").html(gettext("点击查看详情"));
      }
    },

    // 发布部署 - 部署操作tab, 更新
    refresh_roll: function(app_code, app_state, msg_id, show_tip, type) {
      var url = BLUEKING.config.paas_host() + 'release/get_last_release_record/'+app_code+'/';

      $.get(url,{},function(data){
        if(data.res){
          // $(msg_id).parent().parent().hide();
          // var tips_msg = "<span n_m='run' class='mr5'><i class='icon-loading mr5'></i>正在执行" + show_tip + "部署操作，请稍候...</span>";
          // //隐藏部署按钮，显示正在执行状态
          // $('button[n_btn=deploy]').parent().append(tips_msg);
          // $('button[n_btn=deploy]').hide();

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
        var url = BLUEKING.config.paas_host() + 'release/get_deploy_page/'+formId+'/' + app_code + '/';
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
      var url = BLUEKING.config.paas_host() + 'release/get_app_record/' + app_code + '/'+operate_id+'/';
      $.get(url, function(data){
        $('#record_list').html(data);
      });
    },
    // 集成应用（第三方应用）发布记录搜索
    search_tpapp_record: function(app_code, operate_id){
      var url = BLUEKING.config.paas_host() + 'tpapp/release/record_list/' + app_code + '/'+operate_id+'/';
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
      var url = BLUEKING.config.paas_host() + 'release/check_unfinished_task/' + app_code + '/';
      $.get(url, function(data){
      });
    },


    // 使用/取消celery/celery_beat
    check_use_celery: function(is_checked) {
			if(!is_checked){
				//提示
				art.dialog({
							    title: gettext("温馨提示"),
							    width: 340,
							    icon: 'warning',
							    lock: true,
							    content: "<font style='color:red;'>"+gettext("您确认该应用没有使用celery吗？取消celery部署后，应用相关celery功能将不能使用！")+"</font>",
							    ok: function(){
							    	$('#is_use_celery_beat').removeAttr('checked');
							    },
							    okVal: gettext("确认"),
							    cancelVal: gettext("关闭"),
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
							    title: gettext("温馨提示"),
							    width: 340,
							    icon: 'warning',
							    lock: true,
							    content: "<font style='color:red;'>"+gettext("取消“周期性任务”部署，已有周期性任务执行将会失效！您确认取消“周期性任务”部署吗？")+"</font>",
							    ok: function(){},
							    okVal: gettext("确认"),
							    cancelVal: gettext("关闭"),
							    cancel:function(){
							    	$('#is_use_celery_beat').attr('checked', 'checked');
							    }
							});
			}
    }

  };
})();
