/**
 * ajax全局设置
 */
$.ajaxSetup({
  //    timeout: 8000,
  cache: false,
  statusCode: {
    // 401未授权
    401: function(xhr) {
      // 重新加载页面后跳转到登录页面，重新获取登录态
      window.location.reload();
      },
      // 402 权限验证不通过
      402:function(xhr){
        var _src = xhr.responseText;
        ajax_content = '<iframe name="access_control_iframe" frameborder="0" src="'+_src+'"></iframe>';
        art.dialog({id: 'bktips'}).close();
        art.dialog({
            id: 'bktips',
            title: gettext("提示"),
            lock: true, 
            content: ajax_content
      });
        return;
      },
      500: function(xhr, textStatus) {
        art.dialog({id: 'bktips'}).close();
          // 异常
          art.dialog({
              id: 'bktips',
              title: gettext("提示"),
              lock: true, 
              content: gettext("系统出现异常：")+textStatus+"---"+xhr.status+'===='
        });
      }
  },
});
// AJAX请求，获取csrftoken
$('html').ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
    	// 引用jquery cookie使用
    	//var csrftoken = $.cookie('bkcsrftoken');
        // Only send the token to relative URLs i.e. locally.
    	var csrftoken = getCookie('bklogin_csrftoken');
    	xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
});
