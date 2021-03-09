$(function(){
    $("#detail_button").show();
  var logs = $("#logs").val();
  $("#detail_info").text(logs);

  // if operate_id in [0, 1, 2]:
    // if($("#detail_log").is(":hidden") && !$("#release-flow").is(":hidden")){
    if($("#detail_log").is(":hidden")){
      $("#detail_log").show();
      var scrollTop = $("#detail_info")[0].scrollHeight;
      $("#detail_info").scrollTop(scrollTop);
      $("#detail_click").html(gettext("点击隐藏详情"));
    } else {
      // scroll to bottom
      var scrollTop = $("#detail_info")[0].scrollHeight;
      $("#detail_info").scrollTop(scrollTop - $("#detail_info").height());
    }
  // endif
})

