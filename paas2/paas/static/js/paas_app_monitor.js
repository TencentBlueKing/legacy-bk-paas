function switch_control(is_open, app_code){
  var tips = is_open ? gettext("开启"): gettext("停用");
  var content = "<div class='mb10'>"+gettext("您确定")+"\"<font color='red'>"+tips+"</font>\""+gettext("监控告警服务吗")+"?</div>"
  if (!is_open){
    content += tips+gettext("后您将无法接收告警。");
  }else{
    content += tips+gettext("后您可以自定义告警配置。");
  }

  var url = site_url + 'monitor/save_configure/' + app_code + '/';
  art.dialog({
    width: 350,
    icon: 'question',
    lock: true,
    content: content,
    ok: function(){
      // ZENG.msgbox.show('正在'+tips+'，请稍后...', 6, 100000);
      $.post(url,
        {
          "conf_type":"is_open",
          "is_open" :is_open,
        },
        function(data){
          // ZENG.msgbox._hide();
          if(data.result){
            //ZENG.msgbox.show(tips+'成功，正在跳转，请稍后...', 6, 100000);
            window.location.reload();
          }else{
            art.dialog({
              title: gettext("温馨提示"),
              width: 340,
              icon: 'error',
              lock: true,
              content: data.msg,
              ok: function(){},
              okVal: gettext("关闭"),
            });
          }
        }, 'json')
    },
    cancel: function(){},
    okVal: gettext("确定"),
    cancelVal: gettext("取消")
  });
}

function isPositiveInteger(str) {
  return /^\+?([1-9]\d*)$/.test(str);
}

function isValidEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function show_msg(msg, icon) {
  art.dialog({
    title: gettext("温馨提示"),
    width: 340,
    icon: icon,
    lock: true,
    content: msg,
    ok: function(){},
    okVal: gettext("关闭"),
  });
}

// TODO: 提取成独立js
$(function() {

  //告警配置保存,每一类型可单独保存
  $(".config_btn").click(function() {

    var btn_id = $(this).attr('id');
    var app_code = $(this).attr('app_code');
    var data;
    var errors = ["CRITICAL","ERROR","WARNING","INFO","DEBUG"];
    var codes = ["50x","500","501","502","503","504","504",
      "40x","400","401","402","403","404", "error"]

    if (btn_id == "http_config_btn"){
      //HTTP告警配置保存
      var arrayList = [];
      for (i in codes){
        code = codes[i];
        if ($("#http_"+code).attr("checked")){
          arrayList.push(code);
        };
      }
      var request_time_select = "";
      var request_time_gt_or_lt = $("#request_time_gt_or_lt").val();
      var request_time_delay_ms = $("#request_time_delay_ms").val();

      var request_select_checked = $("#request_time_select").attr("checked");

      if(request_select_checked && !isPositiveInteger(request_time_delay_ms)){
        $("#delay_time_tips").html(gettext('输入值不合法!必须为正整数!')).show();
        $("#request_time_delay_ms").focus();
        return
      }
      if (request_select_checked){
        var request_time_select = "request_time";
      }

      var http_status_codes = $("#http_status_codes").val();

      var http_alarm_cycle = $("#http_alarm_cycle").val();
      data =  {
        conf_type:"http",
        http_status_codes:arrayList,
        request_time_select:request_time_select,
        request_time_gt_or_lt:request_time_gt_or_lt,
        request_time_delay_ms:request_time_delay_ms,
        http_alarm_cycle: http_alarm_cycle
      }
    }else if(btn_id == "django_config_btn"){
      //业务告警配置保存
      var django_log_levels = [];
      for (i in errors){
        if ($("#django_"+errors[i]).attr("checked")){
          django_log_levels.push(errors[i]);
        }
      }
      var django_keyword = $("#django_keyword").val();
      var django_operator = $("input[name=django_operator][checked=checked]").val();
      var django_alarm_cycle = $("#django_alarm_cycle").val();
      data = {
        conf_type:"django",
        django_log_levels:django_log_levels,
        django_keyword:django_keyword,
        django_operator:django_operator,
        django_alarm_cycle: django_alarm_cycle
      }
    }else if(btn_id == "celery_config_btn"){
      //celery任务告警配置保存
      var celery_log_levels = [];
      for (i in errors){
        if ($("#celery_"+errors[i]).attr("checked")){
          celery_log_levels.push(errors[i]);
        }
      }
      var celery_keyword = $("#celery_keyword").val();
      var celery_operator = $("input[name=celery_operator][checked=checked]").val();
      var celery_alarm_cycle = $("#celery_alarm_cycle").val();
      data = {
        conf_type:"celery",
        celery_log_levels:celery_log_levels,
        celery_keyword:celery_keyword,
        celery_operator:celery_operator,
        celery_alarm_cycle:celery_alarm_cycle
      }
    }else if(btn_id == "component_config_btn"){
      //组件告警配置保存
      var component_log_levels = [];
      for (i in errors){
        if ($("#component_"+errors[i]).attr("checked")){
          component_log_levels.push(errors[i]);
        }
      }
      var component_alarm_cycle = $("#component_alarm_cycle").val();
      data = {
        conf_type:"component",
        component_log_levels:component_log_levels,
        component_alarm_cycle: component_alarm_cycle
      }
    }else if(btn_id == "receive_config_btn"){
      //接收告警配置人员
      var email_receivers = $("#email_receivers").val();
      if (!email_receivers){
        show_msg(gettext("请输入告警接收人邮箱!"), "error");
        return false;
      }

      var email_array = email_receivers.split(';');
      for(var i = 0; i < email_array.length; i++) {
        email = email_array[i].replace(/^\s*/, "").replace(/\s*$/, "").replace(/[,|;]$/, "");
          if(email != '' && !isValidEmail(email)) {
            show_msg(gettext("请输入正确的邮箱地址, 多个邮箱请用英文的';'隔开! "), "error");
            return false;
          }
      }

      var alarm_list = [];
      if ($("#receive_http").attr("checked")){
        alarm_list.push("http");
      }
      if ($("#receive_django").attr("checked")){
        alarm_list.push("django");
      }
      if ($("#receive_celery").attr("checked")){
        alarm_list.push("celery");
      }
      if ($("#receive_component").attr("checked")){
        alarm_list.push("component");
      }
      data = {
        conf_type: "receive",
        email_receivers: email_receivers,
        alarm_list: alarm_list
      }
    }

    var url = site_url + 'monitor/save_configure/' + app_code + '/';
    $.post(url,
      data,
      function(data,status){
        if(status == "success"){
          show_msg(gettext("保存成功!"), "succeed");
        }else{
          show_msg(gettext("保存失败!"), "error");
        };
      }
    );
  });
  //-----告警配置保存结束-------


  //页面初始化时检查checkbox情况
  if (true) {
    $(".config_check").css("background-color","#f5f5f5");
    //接收人突出显示
    $(".receive_check").css("background-color","rgb(255, 236, 187)");
    console.log('--------------------------A')
  }


  $("input[type=radio]").click(function(){
    var radio_name = $(this).attr('name');
    $("input[name="+radio_name+"]").removeAttr("checked");
    $(this).attr("checked","checked");
  });

  $(".config_check").click(function() {
    var num = $(this).attr("id").split("_").pop();
    $("#basic_alarm_"+num).slideToggle(300);
    var basic_alarm_icon = $("#basic-alarm-icon-"+num);
    if (basic_alarm_icon.hasClass("glyphicon-chevron-down")){
      basic_alarm_icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
      $(this).attr('title', '');
    }else if (basic_alarm_icon.hasClass("glyphicon-chevron-up")){
      basic_alarm_icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
      $(this).attr('title', gettext('展开详情'));
    }
  })

  $("#request_time_select").change(function() {
    if ($(this).attr("checked")){
      $(".request_input").prop('disabled', false);
    }else {
      $(".request_input").prop('disabled', true);
    }
  })

  if ($("#request_select_val").val() == ""){
    $(".request_input").prop('disabled', true);
  }else{
    $("#request_time_select").attr("checked","checked");
    $(".request_input").prop('disabled', false);
  }

  $("#request_time_gt_or_lt option[value='"+$("#gt_or_lt_val").val() +"']").attr("selected", true);

  $("#request_time_delay_ms").blur(function (){
    if ($("#request_time_select").attr("checked")== "checked"){

      if(isNaN($("#request_time_delay_ms").val())){
        $("#delay_time_tips").html(gettext('输入值不合法!')).show();
        $("#request_time_delay_ms").focus();
        return
      }else{
        $("#delay_time_tips").hide();
      }
    }
  })

})
