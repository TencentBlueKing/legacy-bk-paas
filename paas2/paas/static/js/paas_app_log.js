//分页返回
function callback_fun(func_list){
  if (!$("#func_list").val()){
    // if (document.getElementById("func_list").length < func_list.length + 1){
    html = ['<option value="">'+gettext('请选择')+'</option>']
    for (i in func_list){
      if (func_list[i] == $.trim($("#func_list").val())){
        html.push('<option value="'+ func_list[i] +'" selected="selected">'+func_list[i]+'</option>')
      }else{
        html.push('<option value="'+ func_list[i] +'">'+func_list[i]+'</option>')
      }

    }
    $("#func_list").html(html.join(''));
    // 自动滚动到上方
    // $("html, body").animate({ scrollTop: 100 }, "fast");
  }
  //ZENG.msgbox._hide();
}

//enter键触发搜索
function enter_keyword(e){
  if(e.keyCode=='13'){
    $('#j_display_all_app').click();
  }
}
// 清空搜索条件
function delete_input(obj){
  $(obj).prev().val('');
  $('#j_display_all_app').click();
}
// 根据日志类型更换日志级别（uwsgi）
function change_log_type(obj){
  var cur_type = $(obj).val();
  $("#func_list").val('');
  if(cur_type == 'uwsgi' || cur_type == 'access' || cur_type == 'nginx'){
    var log_level_option = '<option value="">'+gettext('全部')+'</option>'+
      '<option value="500">500 Internal Server Error</option>'+
      '<option value="200">200 OK </option>'+
      '<option value="404">404 Not Found </option>'+
      '<option value="50X">50X</option>'+
      '<option value="40X">40X</option>'+
      '<option value="30X">30X</option>'+
      '<option value="20X">20X</option>';
    $("#log_level").html(log_level_option);
    $("#msg_name").html("URI:&nbsp;");
  } else {
    var log_level_option = '<option value="">'+gettext('全部')+'</option>'+
      '<option value="ERROR">ERROR</option>'+
      '<option value="INFO">INFO</option>'+
      '<option value="WARNING">WARNING</option>' +
      '<option value="DEBUG">DEBUG</option>'+
      '<option value="CRITICAL">CRITICAL</option>';
    $("#log_level").html(log_level_option);
    $("#msg_name").html(gettext("信息:"))
  }

  if (cur_type == 'django' || cur_type == 'component'){
    $(".func").show();
  }else{
    $(".func").hide();
  }

  $(".level").show();

  if (cur_type == 'uwsgi' || cur_type == 'nginx') {
    $(".order").show();
    $("#timestamp").attr('selected','selected');
  } else {
    $(".order").hide();
  }

}


function get_datepicker_config() {
  var datepicker = {
    "showDropdowns": false,//显示年，月下拉选择框
    "showWeekNumbers": false,//显示第几周
    "timePicker": true,//时间选择
    "timePicker24Hour": true,//24小时制
    "timePickerIncrement": 1,//时间间隔
    "timePickerSeconds": true,
    "dateLimit": { //可选择的日期范围
      "days": 14
    },
    "locale": {
      "format": "YYYY-MM-DD HH:mm:ss",// 日期格式
      "separator": gettext(" 至 "),
      "applyLabel": gettext("确定"),
      "cancelLabel": gettext("取消"),
      "fromLabel": gettext("从"),
      "toLabel": gettext("到"),
      "weekLabel": gettext('周'),
      "customRangeLabel": gettext("自定义"),
      "daysOfWeek": [
        gettext("日"),
        gettext("一"),
        gettext("二"),
        gettext("三"),
        gettext("四"),
        gettext("五"),
        gettext("六")
      ],
      "monthNames": [
        gettext("一月"),
        gettext("二月"),
        gettext("三月"),
        gettext("四月"),
        gettext("五月"),
        gettext("六月"),
        gettext("七月"),
        gettext("八月"),
        gettext("九月"),
        gettext("十月"),
        gettext("十一月"),
        gettext("十二月")
      ],
      "firstDay": 1// 周开始时间
    },
    "startDate": moment().subtract(5, 'minutes'),
    "endDate": moment(),
    "minDate": moment().subtract(13, 'days'),
    "maxDate": moment().add(1, 'hours'),
    "opens": "right",//left/center/right
    "drops": "down",//选择框出现的位置 up/down
    "buttonClasses": "btn btn-sm",//按钮通用样式
    "applyClass": "btn-azure",//确定按钮样式
    "cancelClass": "btn-cancel"//取消按钮样式
  };
  return datepicker;
}

function set_log_time(start, end, label) {
  var start_date = start.format('YYYY-MM-DD HH:mm:ss');
  var end_date = end.format('YYYY-MM-DD HH:mm:ss');

  if (start_date == "Invalid date" || end_date == "Invalid date") {
    //ZENG.msgbox.show("时间格式错误, 请重新选择!", 3, 2000);
  };

  $("#log_time_begin").val(start_date);
  $("#log_time_end").val(end_date);
}

function alarm_invalid_page_number() {
  art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: false, content: gettext('错误的搜索参数! 页码格式错误, 只能为正整数')});
}

// 查询app列表
$(function(){
  $('#datepicker').daterangepicker(get_datepicker_config(), set_log_time);

  // 时间选择变化
  $("#log_time").on('change', function(e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    if (valueSelected == "diy") {
      $('#datepicker').daterangepicker(get_datepicker_config(), set_log_time);

      $("#datepicker").toggle(true);
      var start_date = moment().subtract(5, "minutes").format('YYYY-MM-DD HH:mm:ss');
      var end_date = moment().format('YYYY-MM-DD HH:mm:ss');
      $("#log_time_begin").val(start_date);
      $("#log_time_end").val(end_date);
    } else {
      $("#datepicker").toggle(false);
      $("#log_time_begin").val('');
      $("#log_time_end").val('');
    }
  });

  // 进来后点击搜索
  $("#j_display_all_app").click();

});

