$(function(){
  $('.apply_single').click(function(){
    var obj = this;
    var api_name = $(this).data('apiname');
    var api_id = $(this).data('apiid');
    $(obj).attr('disabled', true);
    $.post(site_url + 'esb_auth/esb_api_auth_apply/' + app_code + '/'+ sys_name +'/', {
      'api_id': api_id,
      'api_name': api_name
    }, function(res){
      if(res.result){
        art.dialog({
          title: gettext("温馨提示"),
          width: 450,
          icon: 'succeed',
          lock: true,
          content: gettext("权限申请已提交，请耐心等待审批！"),
          ok: function(){},
          okVal: gettext("关闭"),
          time: 2
        });
        get_esb_sys_api_html(sys_name);
      }else{
        art.dialog({
          title: gettext("温馨提示"),
          width: 450,
          icon: 'error',
          lock: true,
          content: res.message,
          ok: function(){},
          okVal: gettext("关闭"),
          time: 2
        });
        $(obj).attr('disabled', false);
      }
    }, 'json');
  })
})

