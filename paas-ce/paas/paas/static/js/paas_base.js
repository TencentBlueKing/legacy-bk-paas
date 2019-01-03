/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
            '<span class="f_l">快捷入口：</span>'+
            '<a href="'+app_test_url+'" target="_blank" class="f_l" style="width:50px;margin-left:12px;">测试环境</a>'+
            '<a href="'+app_prod_url+'" target="_blank" class="" style="width:50px;margin-left:135.5px;">正式环境</a>'
        );
      },
      pro_test_off:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">快捷入口：</span>'+
            '<span data-toggle="tooltip" data-placement="top" title="应用未提测或已下架" style="color:#999;width:50px;margin-left:12px;">测试环境</span>'+
            '<span data-toggle="tooltip" data-placement="left" title="应用未上线或已下架" style="color:#999;width:50px;margin-left:15.5px;">正式环境</span>'
        );
      },
      pro_on_test_off:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">快捷入口：</span>'+
            '<span class="f_l" data-toggle="tooltip" data-placement="top" title="应用未提测或已下架" style="color:#999;width:50px;margin-left:12px;">测试环境</span>'+
            '<a href="'+app_prod_url+'" target="_blank" class="" style="width:50px;margin-left:135.5px;">正式环境</a>'
        );
      },
      pro_off_test_on:function(app_test_url, app_prod_url){
        $("#pro-test").html(
            '<span class="f_l">快捷入口：</span>'+
            '<a href="'+app_test_url+'" target="_blank" class="f_l" style="width:50px;margin-left:12px;">测试环境</a>'+
            '<span data-toggle="tooltip" data-placement="left" title="应用未上线或已下架" style="color:#999;width:50px;margin-left:13.5px;">正式环境</span>'
        );
      },
      refresh_app_status:function(app_code){
          var url = BLUEKING.config.paas_host() + "app/"+app_code+"/status/";
          $.get(url, {}, function(resp){
              data = resp.data;
              app_test_url = data.app_test_url;
              app_prod_url = data.app_prod_url;
              if(data.status == 1){
                  BASE_APP.pro_test_on(app_test_url, app_prod_url);
              }
              else if(data.status == 2){
                  BASE_APP.pro_off_test_on(app_test_url, app_prod_url);
              }else if(data.status == 3){
                  BASE_APP.pro_on_test_off(app_test_url, app_prod_url);
              }else{
                  BASE_APP.pro_test_off(app_test_url, app_prod_url);
              }
              // 渲染应用名称
              $("#app_info_name_id").text(data.app_name);
              $("#app_info_name_id").attr('title', data.app_name);
              // logo
              $("#app_logo_now").attr('src', data.app_log_url);
          }, 'json');
      },
      modify_app_logo: function(app_code, is_saas){
        var logo_test = $("#logo_m");
        if(is_saas){
          var url_prefix = 'saas';
        }else{
          var url_prefix = 'app'
        }
        var url = BLUEKING.config.paas_host() + url_prefix +"/"+app_code+"/logo/";
        $("#form_logo").attr('action', url)
        art.dialog({
              title: "温馨提示",
              width: 340,
              icon: 'warning',
              lock: true,
              content: $("#div_m_logo").get(0),
              ok: function(){
                var value =document.getElementById("logo_m").value;
              if(value == '' || value==null){
                $("#logo_error_tips").html('请选择要上传的图片');
                return false;
              }
              else if(value.substring(value.lastIndexOf(".")+1)!="png"){
                $("#logo_error_tips").html('上传图片必须为png格式');
                return false;
              }
              else if(logo_test.get(0).files[0].size > 6*1024*1024){
                $("#logo_error_tips").html('图片大小限制为6M');
                return false;
              }
              else{
                $('#form_logo').target="logo_target_frame";
                $('#form_logo').submit();
              }
              },
              okVal: "确定",
              cancel: function(){},
            cancelVal: "取消"
        });
      }
    }
  })()

