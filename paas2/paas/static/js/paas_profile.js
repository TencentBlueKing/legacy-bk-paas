// 用户中心相关
APP_PROFILE = (function(){
    return{
        // 修改用户密码
        change_password:function(){
            $('.error_tip').hide();
            $(".password_input").val('');
            $("#password_tip").text('');
            art.dialog({
                id: "bktips",
                title:"重置密码",
                lock: true,
                width: 500,
                content: $("#change_password_div").get(0),
                cancelVal: "取消",
                cancel: function(){
                },
                okVal: "重置密码",
                ok: function(){
                    var flag = true;
                    $('.error_tip').hide();
                    $("#pattern_tip").css('color', 'black');
                    $(".password_input").each(function(){
                        var curl_val = $.trim($(this).val());
                        if(!curl_val){
                            $(this).next('.error_tip').show();
                            $(this).focus();
                            flag = false;
                            return false;
                        }
                        // 第一个密码需要验证格式
                        if (!curl_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9!@#\$%\^\*\(\)-_\+=]{8,20}$/) && $(this).attr('name')=='password1'){
                            $("#pattern_tip").css('color', 'red');
                            $(this).focus();
                            flag = false;
                            return false;
                        }
                    });
                    if(!flag){
                        return false;
                    }
                    var old_password = $.trim($("#id_old_password").val());
                    var password1 = $.trim($("#id_password1").val().trim());
                    var password2 = $.trim($("#id_password2").val().trim());
                    if(password1 != password2){
                        $("#password_tip").text('两次输入的新密码不一致');
                        flag = false;
                    }
                    if(!flag){
                        return false;
                    }else{
                        var url = BLUEKING.config.paas_host() + 'accounts/user/password/';
                        var post_flag = true;
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: {
                                        'old_password':old_password,
                                        'new_password1':password1,
                                        'new_password2':password2,
                                      },
                            success: function(data){
                               if(data.result){
                                  //art.dialog({id: 'bktips'}).close();
                              }else{
                                  $("#password_tip").text(data.message);
                                  post_flag = false;
                              }
                            },
                            dataType: 'json',
                            async: false,
                        });
                        // 出错则不关闭当前对话框
                        if(!post_flag){
                          return false;
                        }else{
                          art.dialog({width: 300,icon: 'succeed',lock: true,content: '密码重置成功'}).time(1);
                          // logout
                          window.location.href = "/accounts/logout/";
                      }
                    }
                }
            });
        },
        // 修改个人信息
        show_modify_user: function(){
          var url = BLUEKING.config.paas_host() + 'accounts/user/info/';
          $.get(url, {}, function(data){
              art.dialog({
                id: "bktips",
                title:"修改个人信息",
                lock: true,
                width: 500,
                content: data
              });
          })
        },
        // 保存用户信息
        modify_user_info: function(){
          var chname = $.trim($("#chname").val());
          if (!chname.match(/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,16}$/)){
              $("#error_tip").html('中文名只能包含数字、字母、中文汉字、<br><span style="margin-left:105px">下划线，长度在1-16个字符</span>');
              $('#chname').focus();
              return false;
          }
          var phone = $.trim($("#phone").val());
          if (!phone.match(/^\d{11}$/)){
              $("#error_tip").text('仅支持中国大陆手机号码（11位数字）')
              $('#phone').focus();
              return false;
          }
          var email = $.trim($("#email").val());
          if (!email.match(/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/)){
              $("#error_tip").text('请输入正确的邮箱格式')
              $('#email').focus();
              return false;
          }
          var url = site_url + 'accounts/user/info/';
          $.post(url,{
            chname: chname,
            phone: phone,
            email: email
          },function(data){
            if(data.result){
              art.dialog({id: 'bktips'}).close();
              art.dialog({
                id: 'bktips',
                width: 300,
                icon: 'succeed',
                lock: true,
                content: '用户信息修改成功'
              })
              setTimeout(window.location.reload(),1000);
            }else{
              $("#error_tip").text(data.message)
            }
          }, 'json')
        },
        // 取消编辑
        cancel_edit: function(){
          art.dialog({id: 'bktips'}).close();
        }
    }
})()

$("#show_password_change").on('click', APP_PROFILE.change_password);
$("#show_modify_user").on('click', APP_PROFILE.show_modify_user);

