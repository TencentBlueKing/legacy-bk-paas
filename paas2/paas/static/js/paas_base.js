/**
 * 页面滚动条
 */
  var minHeight = 100;
  var scrollOffset = $(document).height()-$(window).height() - 100;
  var returnTopDom = $('#return_top');
  var returnBottomDom = $('#return_bottom');

  //确定按钮位置
  function setBtnPosition(){
    var returnTopLeft = $('#body').offset().left + $('#body').width() + 10;
    if ($(window).width() >= returnTopLeft) {
      $('.return_btn').css({'left': returnTopLeft+'px'});
    } else {
      $('.return_btn').css({'left': 'auto', 'right': '10px', 'position': 'fixed'});
    }
  }
  //监听滚动条
  $(window).on('scroll',function(){
    var sTop = $(this).scrollTop();
    if (sTop > minHeight){
      returnTopDom.fadeIn(300);
    }else{
      returnTopDom.fadeOut(300);
    }

    if (sTop >= scrollOffset){
      returnBottomDom.fadeOut(300);
    }else{
      returnBottomDom.fadeIn(300);
    }
  });

  //监听窗口resize
  $(window).on('resize',function(){
    setBtnPosition();
  });

  //返回顶部
  returnTopDom.on('click',function(){
    $('html,body').animate({scrollTop:0},700);
    return false;
  });
  returnBottomDom.on('click',function(){
    $('html,body').animate({scrollTop:scrollOffset+100},700);
    return false;
  });
  setBtnPosition();
  $(window).trigger('scroll');

  // base_app页面内容
  BASE_APP = (function(){
    return{
      pro_test_on:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
            '<a href="'+app_test_url+'" target="_blank" class="f_l" style="width:50px;margin-left:12px;">'+gettext('测试环境')+'</a>'+
            '<a href="'+app_prod_url+'" target="_blank" class="" style="width:50px;margin-left:135.5px;">'+gettext('正式环境')+'</a>'
        );
      },
      pro_test_off:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
            '<span data-toggle="tooltip" data-placement="top" title="'+gettext('应用未提测或已下架')+'" style="color:#999;width:50px;margin-left:12px;">'+gettext('测试环境')+'</span>'+
            '<span data-toggle="tooltip" data-placement="left" title="'+gettext('应用未上线或已下架')+'" style="color:#999;width:50px;margin-left:15.5px;">'+gettext('正式环境')+'</span>'
        );
      },
      pro_on_test_off:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
            '<span class="f_l" data-toggle="tooltip" data-placement="top" title="'+gettext('应用未提测或已下架')+'" style="color:#999;width:50px;margin-left:12px;">'+gettext('测试环境')+'</span>'+
            '<a href="'+app_prod_url+'" target="_blank" class="" style="width:50px;margin-left:135.5px;">'+gettext('正式环境')+'</a>'
        );
      },
      pro_off_test_on:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
            '<a href="'+app_test_url+'" target="_blank" class="f_l" style="width:50px;margin-left:12px;">'+gettext('测试环境')+'</a>'+
            '<span data-toggle="tooltip" data-placement="left" title="'+gettext('应用未上线或已下架')+'" style="color:#999;width:50px;margin-left:13.5px;">'+gettext('正式环境')+'</span>'
        );
      },
      refresh_app_status:function(app_code){
          var url = BLUEKING.config.paas_host() + "app/status/"+app_code+"/";
          $.get(url, {}, function(res){
              app_test_url = res.app_test_url;
              app_prod_url = res.app_prod_url;
              if(res.result == 1){
                  BASE_APP.pro_test_on(app_test_url, app_prod_url);
              }
              else if(res.result == 2){
                  BASE_APP.pro_off_test_on(app_test_url, app_prod_url);
              }else if(res.result == 3){
                  BASE_APP.pro_on_test_off(app_test_url, app_prod_url);
              }else{
                  BASE_APP.pro_test_off(app_test_url, app_prod_url);
              }
              // 渲染应用名称
              $("#app_info_name_id").text(res.app_name);
              $("#app_info_name_id").attr('title', res.app_name);
              // logo
              $("#app_logo_now").attr('src', res.app_log_url);
          }, 'json');
      },
      refresh_tpapp_status: function(app_code){
          var url = BLUEKING.config.paas_host() + "app/status/"+app_code+"/";
          var app_url = BLUEKING.config.paas_host() + "console/?app=" + app_code;
          $.get(url, {}, function(res){
              if(res.result == 1 || res.result == 3){
                $("#pro-test").html(
                    '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
                    '<a href="'+app_url+'" target="_blank" class="" style="width:50px;margin-left:73.5px;">'+gettext('访问地址')+'</a>'
                );
              }else{
                $("#pro-test").html(
                    '<span class="f_l">'+gettext('快捷入口')+'：</span>'+
                    '<span data-toggle="tooltip" data-placement="left" title="'+gettext('应用未上线或已下架')+'" style="color:#999;width:50px;margin-left:13.5px;">'+gettext('访问地址')+'</span>'
                );
              }
              // 渲染应用名称
              $("#app_info_name_id").text(res.app_name);
              $("#app_info_name_id").attr('title', res.app_name);
              // logo
              $("#app_logo_now").attr('src', res.app_log_url);
          }, 'json');
      },
      modify_app_logo: function(app_code, is_saas){
        var logo_test = $("#logo_m");
        if(is_saas){
          var url_prefix = 'saas';
        }else{
          var url_prefix = 'app'
        }
        var url = BLUEKING.config.paas_host() + url_prefix +"/modify_app_logo/"+app_code+"/";
        $("#form_logo").attr('action', url)
        art.dialog({
              title: gettext("温馨提示"),
              width: 340,
              icon: 'warning',
              lock: true,
              content: $("#div_m_logo").get(0),
              ok: function(){
                var value =document.getElementById("logo_m").value;
              if(value == '' || value==null){
                $("#logo_error_tips").html(gettext('请选择要上传的图片'));
                return false;
              }
              else if(value.substring(value.lastIndexOf(".")+1)!="png"){
                $("#logo_error_tips").html(gettext('上传图片必须为png格式'));
                return false;
              }
              else if(logo_test.get(0).files[0].size > 6*1024*1024){
                $("#logo_error_tips").html(gettext('图片大小限制为6M'));
                return false;
              }
              else{
                $('#form_logo').target="logo_target_frame";
                $('#form_logo').submit();
              }
              },
              okVal: gettext("确定"),
              cancel: function(){
                $("#logo_error_tips").html("");
              },
            cancelVal: gettext("取消")
        });
      }
    }
  })()

