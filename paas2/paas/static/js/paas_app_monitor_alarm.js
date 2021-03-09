function get_datepicker_config() {
  var datepicker = {
    "showDropdowns": false,//显示年，月下拉选择框
    "showWeekNumbers": false,//显示第几周
    "timePicker": true,//时间选择
    "timePicker24Hour": true,//24小时制
    "timePickerIncrement": 1,//时间间隔
    "timePickerSeconds": true,
    "dateLimit": { //可选择的日期范围
      "days": 30
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
    "minDate": moment().subtract(29, 'days'),
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


$(function(){
  // 时间选择变化
  $("#alarm_time").on('change', function(e) {
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

});
