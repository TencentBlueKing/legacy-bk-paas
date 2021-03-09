//全局设置
var S = {
  // 其他参数...
  debug: false        // 调试模式设置，正式环境上，应该设置为false。如果为false，则缓存加载的css、js文件
};
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
var BLUEKING = {
        BK_HOST: function(){
            var host_now = window.location.host;
            return host_now;
        }
};
// paas_host 为settings 中SITE_URL的值
BLUEKING.config = (function(){
    return {
        paas_host: function(){
            return '/';
        }
    }
})()
var staticUrl = BLUEKING.config.paas_host() + 'static/';
//var staticUrl = 'http://1251000004.cdn.myqcloud.com/1251000004/bk_paas/';
//csrftoken处理js
document.write(" <script lanague=\"javascript\" src=\""+staticUrl+"js/csrftoken.min.js?v=1\"> <\/script>");
