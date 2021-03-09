$(function() {
  // 锚点跳转并打开对应步骤
  var  anchor_links = $('.anchor-link'),
    time_label = $('.time-label');

  anchor_links.click(function() {
    var index = $(this).attr('data-index');
    if ($(time_label[index]).hasClass('open')) {
      return;
    }else{
      $(time_label[index]).addClass('open');
      $(time_label[index]).children(".king-timeline-item").slideDown(350);
    };
  });

  $(".king-timeline-header").click(function(e) {
    e.preventDefault();
    var time_li = $(this).parent("li");
    var time_cont = $(this).next(".king-timeline-item");

    if (time_li.hasClass("open")) {
      time_cont.slideUp(350);
      time_li.removeClass("open");
    } else {
      time_cont.slideDown(350);
      time_li.addClass("open");
    }
  });
  $("#show_south").click(function(){
    if($("#show_south").hasClass("show_simple")){
      $("#show_south").removeClass("show_simple");
      $("#show_south").html(gettext("查看简单使用"));
      $("#simple_south").hide();
      $("#detail_south").show();
    }else{
      $("#show_south").addClass("show_simple");
      $("#show_south").html(gettext("查看详细使用"));
      $("#detail_south").hide();
      $("#simple_south").show();
    }
  });
  $("#show_migrate").click(function(){
    if($("#show_migrate").hasClass("show_simple_18")){
      $("#show_migrate").removeClass("show_simple_18");
      $("#show_migrate").html(gettext("查看简单使用"));
      $("#simple_migrate").hide();
      $("#detail_migrate").show();
    }else{
      $("#show_migrate").addClass("show_simple_18");
      $("#show_migrate").html(gettext("查看详细使用"));
      $("#detail_migrate").hide();
      $("#simple_migrate").show();
    }
  });
});

