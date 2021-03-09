$(function(){
  $("#apply_storage").on('click', function(){
    $(this).attr({"disabled":"disabled"});
    $(this).text('申请中,请稍候...');
    app_code = $(this).attr("app_code");
    var url = site_url + 'storage/apply/' + app_code + '/';
    $.post(url, function(data){
      if(data.resutl){
        window.location.href = site_url + 'storage/info/' + app_code + '/';
      }else{
        $("#apply_storage").text('获取 1G 存储空间');
        $("#apply_info").html(data.msg);
      }
    }, 'json')
  });

  $('ul.tab_navs li').click(function(){
      $('ul.tab_navs li').removeClass('selected');
      $(this).addClass('selected');
      var index = $(this).attr('data-index');
      $('div[data-index]').hide();
      $('div[data-index='+index+']').show();
  });

});
