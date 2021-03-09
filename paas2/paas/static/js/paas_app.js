/*
 * 应用 创建展示相关
 */
// 我的应用页面相关
APP_LIST = (function(){
    return{
        // 查询列表分页的回调方法
        _callback_fun:function(){
          var total_app = $('#table_app thead').attr('total_app'); //获取app总数
          $("#total_app").text(total_app);
          if(typeof(total_app) != "undefined"){
            if(parseInt(total_app)==0){
              $("#page").hide();        //app个数为0时隐藏分页条
              $("#app_num_div").hide();
              $("#app_num").text(total_app);
            }else{
              $("#page").show();        //app个数为0时显示分页条
              $("#app_num_div").show();
              $("#app_num").text(total_app);
            }
          } else {
              // 隐藏个数
              $("#app_num_div").hide();
          }
        },
        // 查询App列表
        // note:需要在之前引用 pagination.js 文件
        search_app:function(){
          var keyword = $.trim($("#search_app").val());
          // check keyword
          if (keyword.indexOf('&') != -1) {
            art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: true,content: gettext("错误的搜索参数! 参数中不能包含符号[&]")});
            return
          }

          //获取当前tabid
          var status = $('#status').val();
          var hide_outline = $('#set_hide_outline').val();
          //分页请求
          var opt={
            url:BLUEKING.config.paas_host() +'app/query_list/?keyword='+keyword+'&'+'hide_outline='+hide_outline+'&',
            items_per_page:8,
            current_page:1,
            callback:APP_LIST._callback_fun,
            table_obj:'#table_app'
          };
          $("#pagination_id").pagination(opt);
        },
        // 查询按钮
        // 清空搜索条件
        clear_search_input:function(){
          $('#search_app').val('');
          $("#close_span").css('display', 'none');
          $('#j_display_all_app').click();
        }
    }
})(),
// 应用创建
APP_CREATE = (function(){
    return{
        _check_app_code:function(){
          var re_code = false;
          $.ajax({
            type: 'GET',
            url: BLUEKING.config.paas_host() +'app/check_app_code/',
            data: {app_code: $.trim($('#code').val())},
            success: function(d){
              if(d.result){
                re_code = true
              }else{
                $('#tip_code').html(d.message);
                re_code = false;
              }
            },
            dataType: 'json',
            async: false,
          });
          return re_code;
        },
        _check_app_name:function(){
          var re_name = false;
          var operation = $("#name").attr('operation');
          if(operation == 'modify'){
              var old_name = $.trim($('#name').val());
          }else{
              var old_name = '';
          }

          $.ajax({
            type: 'GET',
            url: BLUEKING.config.paas_host() +'app/check_app_name/',
            data: {'name': $.trim($('#name').val()), 'old_name': old_name},
            success: function(d){
              if(d.result){
                re_name = true
              }else{
                $('#tip_name').html(d.message);
                re_name = false;
              }
            },
            dataType: 'json',
            async: false,
          });

          return re_name;
        },
        check_app_code:function(is_focus){
         var flag = true;
         if($.trim($("#code").val()) == ''){
            $('#tip_code').html(gettext('请填写应用 ID'));
            flag = false;
          }else{
            var return_re = APP_CREATE._check_app_code();
            flag = return_re;
            if(return_re){
              $('#tip_code').html('');
            }
          }
          if(!flag && is_focus==1){
            $("#code").focus();
          }
          return flag;
        },
        check_app_name:function(is_focus){
          var flag = true;
          if($.trim($("#name").val()) == ''){
            $('#tip_name').html(gettext('请填写应用名称'));
            flag = false;
          }else{
            var return_re = APP_CREATE._check_app_name();
            flag = return_re;
            if(return_re){
              $('#tip_name').html('');
            }
          }
          if(!flag && is_focus==1){
            $("#name").focus();
          }
          return flag;
        },
        check_introduction:function(is_focus){
          var flag = true;
          if($.trim($("#introduction").val()) == ''){
            $('#tip_introduction').html(gettext('请填写应用简介'));
            flag = false;
          }else if(UTILS.chkstrlen($.trim($('#introduction').val())) > 30){
            $('#tip_introduction').html(gettext('长度不能超过30个字符'));
            flag = false;
          }else{
            $('#tip_introduction').html('');
          }
          if(!flag && is_focus==1){
            $("#introduction").focus();
          }
          return flag;
        },
        check_app_tags:function(){
            var flag = true;
            var apptags = $.trim($("#app_tags").val());
            if(apptags == ''){
                flag = false;
            }
            return flag;
        },
        check_external_url: function(is_focus){
          var flag = true;
          // 不存在系统链接则无需校验
          if($("#external_url").length == 0){
            return flag;
          }
          // 类型：创建or修改信息
          var tip_obj = $("#tip_name");
          if($("#form_app").length){
            tip_obj = $("#tip_external_url");
          }
          var external_url = $.trim($("#external_url").val());
          var url_pattern = new RegExp("^(http[s]{0,1})://", "gi");
          if( external_url.match(url_pattern) ){
              tip_obj.html('');
          }else{
              tip_obj.html(gettext('请填写正确的系统URL，支持http和https'));
              flag = false;
          }
          if(!flag && is_focus==1){
            $("#external_url").focus();
          }
          return flag;
        },
        check_vcs_url:function(is_focus){
          var flag = true;
          var vcs_url = $.trim($("#vcs_url").val());

          if (vcs_url.indexOf(" ") !== -1 || vcs_url.indexOf("|") !== -1 || vcs_url.indexOf("&") !== -1 || vcs_url.indexOf(";") !== -1) {
            $("#tip_vcs_url").html(gettext('请填写正确的仓库地址'));
            if(is_focus==1){
              $("#vcs_url").focus();
            }
            return false;
          }
          // if (vcs_url.length != $("#vcs_url").val().length) {
          //     $("#tip_vcs_url").html('请填写正确的仓库地址, 不能包含空格');
          //     if(is_focus==1){
          //       $("#vcs_url").focus();
          //     }
          //     return false;
          // } else {
          //     $("#tip_vcs_url").html('');
          // }

          var vcs_type = $("input[name='vcs_type']:checked").val();
          if(!vcs_type){
            vcs_type = $("#vcs_type_id").val();
          }
          if(vcs_type == '0'){
            // var url_pattern = new RegExp("(http[s]{0,1}|git)://", "gi");
            var url_pattern = new RegExp(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/, "gi")
          }else{
            var url_pattern = new RegExp("(http[s]{0,1}|svn)://[a-zA-Z0-9]", "gi");
          }

          if( vcs_url.match(url_pattern) ){
              $("#tip_vcs_url").html('');
          }else{
              $("#tip_vcs_url").html(gettext('请填写正确的仓库地址'));
              flag = false;
          }
          if(!flag && is_focus==1){
            $("#vcs_url").focus();
          }
          return flag;
        },
        check_vcs_username:function(is_focus){
          var flag = true;
          var vcs_username = $.trim($("#vcs_username").val());
          if(vcs_username == ''){
              $("#tip_vcs_username").html(gettext('请填写账号'));
              if(is_focus==1){
                $("#vcs_username").focus();
              }
              flag = false;
          }else{
              $("#tip_vcs_username").html('');
          }
          return flag;
        },
        check_vcs_password:function(is_focus){
          var flag = true;
          var vcs_password = $.trim($("#vcs_password").val());
          if(vcs_password == ''){
              $("#tip_vcs_password").html(gettext('请填写密码'));
              if(is_focus==1){
                $("#vcs_password").focus();
              }
              flag = false;
          }else{
              $("#tip_vcs_password").html('');
          }
          return flag;
        },
        check_db_host:function(){
          var flag = true;
          var db_host = $.trim($("#db_host").val());
          if(!db_host){
              $("#tip_db_host").html(gettext('请填写HOST'));
              flag = false;
          }else{
              $("#tip_db_host").html('');
          }
          return flag;
        },
        check_db_port:function(){
          var flag = true;
          var db_port = $.trim($("#db_port").val());
          if(!UTILS.isInt(db_port)){
              $("#tip_db_port").html(gettext('请填写端口，必须为数字'));
              flag = false;
          }else{
              $("#tip_db_port").html('');
          }
          return flag;
        },
        check_db_username:function(){
          var flag = true;
          var db_username = $.trim($("#db_username").val());
          if(!db_username){
              $("#tip_db_username").html(gettext('请填写数据库用户名'));
              flag = false;
          }else{
              $("#tip_db_username").html('');
          }
          return flag;
        },
        check_window_width_height:function(){
          var width = $.trim($("#width").val());
          var height = $.trim($("#height").val());
          if (parseInt(width) > 10000) {
              $("#tip_desktop").html(gettext('宽度超过10000px，请设置合适的宽度'));
              return false;
          }
          if (parseInt(height) > 10000) {
              $("#tip_desktop").html(gettext('高度超过10000px，请设置合适的宽度'));
              return false;
          }

          if(!UTILS.isInt(width) || parseInt(width) <= 0){
              $("#tip_desktop").html(gettext('请填写宽度，必须为正整数'));
              return false;
          }else{
              $("#tip_desktop").html('');
          }
          if(!UTILS.isInt(height) || parseInt(height) <= 0){
            $("#tip_desktop").html(gettext('请填写高度，必须为正整数'));
            return false;
          }else{
              $("#tip_desktop").html('');
          }
          return true;
        },
        // 提交数据前验证表单
        validate_form:function(){
          $(".tips").text('');
          var flag = false;
          flag = APP_CREATE.check_app_code(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_app_name(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_introduction(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_app_tags(1);
          if(!flag){return false;}
          // 普通应用
          flag = APP_CREATE.check_vcs_url(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_vcs_username(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_vcs_password(1);
          if(!flag){return false;}
          $('button').attr('disabled', 'disabled');

          art.dialog({id: 'bktips',width: 300,icon: 'face-smile',lock: true,content: gettext('正在创建应用，请稍后...')});

          return true;
        },
        // 集成应用创建提交数据前验证表单
        validate_tpapp_form:function(){
          $(".tips").text('');
          var flag = false;
          flag = APP_CREATE.check_app_code(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_app_name(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_introduction(1);
          if(!flag){return false;}
          flag = APP_CREATE.check_app_tags(1);
          if(!flag){return false;}

          flag = APP_CREATE.check_external_url(1);
          if(!flag){return false;}

          $('button').attr('disabled', 'disabled');
          art.dialog({id: 'bktips',width: 300,icon: 'face-smile',lock: true,content: gettext('正在创建应用，请稍后...')});
          return true;
        },
    }
})(),
// 应用基本信息页面相关函数
APP_INFO = (function(){
    return{
        // 保存基本信息
        save_base_info:function(){
            // 验证前台输入
            var flag = false
            flag = APP_CREATE.check_app_name();
            if(!flag){return false;}
             // 如果是集成应用（第三方应用）需要校验系统链接
             flag = APP_CREATE.check_external_url();
             if(!flag){return false;}
             // 后台保存
             var app_code = $("#app_code_id").val();
             var modify_app_url = BLUEKING.config.paas_host() +'app/modify/' +app_code + '/';

             $.ajax({
                type: 'POST',
                url: modify_app_url,
                data: {
                     'operate': 'base',
                     'name': $.trim($("#name").val()),
                     'app_tags': $.trim($("#app_tags").val()),
                     'external_url': $.trim($("#external_url").val()),
                 },
                success: function(data){
                    flag = data.result;
                   if(!flag){
                       $('#tip_name').html(data.msg);
                   }else{
                       $("#app_tags_dis").html($("#app_tags option[value="+ $("#app_tags").val() +"]").text());
                   }
                },
                dataType: 'json',
                async: false,
              });

             return flag;
        },
        // 获取代码仓库的密码
        get_vcs_password:function(){
          var app_code = $("#app_code_id").val();
          var vcs_password = '';
          var url = BLUEKING.config.paas_host() +'app/get_vcs_password/' +app_code + '/';
          $.ajax({
                type: 'GET',
                url: url,
                data: {},
                success: function(data){
                   vcs_password = data.msg;
                },
                dataType: 'json',
                async: false,
            });
            return vcs_password;
        },
        // 保存应用简介
        save_introduction: function(){
            // 验证前台输入
            var flag = false;
            flag = APP_CREATE.check_introduction();
              if(!flag){return false;}
              // 后台保存
            var app_code = $("#app_code_id").val();
            var modify_app_url = BLUEKING.config.paas_host() +'app/modify/' +app_code + '/';

              $.ajax({
                type: 'POST',
                url: modify_app_url,
                data: {
                     'operate': 'introduction',
                     'introduction': $.trim($("#introduction").val())
                 },
                success: function(data){
                  flag = data.result;
                   if(!flag){
                       $('#tip_introduction').html(data.msg);
                   }
                },
                dataType: 'json',
                async: false,
              });

             return flag;
        },
        // 保存源代码信息
        save_vcs:function(){
            // 验证前台输入
            var flag = false;
            flag = APP_CREATE.check_vcs_url();
              if(!flag){return false;}
              flag = APP_CREATE.check_vcs_username();
              if(!flag){return false;}
              flag = APP_CREATE.check_vcs_password();
              if(!flag){return false;}
              // 后台保存
              var app_code = $("#app_code_id").val();
             var modify_app_url = BLUEKING.config.paas_host() +'app/modify/' +app_code + '/';

             $.ajax({
                type: 'POST',
                url: modify_app_url,
                data: {
                     'operate': 'vcs',
                     'vcs_type': $("#vcs_type_id").val(),
                     'vcs_url': $.trim($("#vcs_url").val()),
                     'vcs_username': $.trim($("#vcs_username").val()),
                     'vcs_password': $.trim($("#vcs_password").val())
                 },
                success: function(data){
                   flag = data.result;
                   if(!flag){
                       $('#tip_vcs').html(data.msg);
                   }
                },
                dataType: 'json',
                async: false,
              });

             return flag;
        },
        // 保存db信息
        save_db_info: function(){
            // 验证前台输入
            var flag = false;
            flag = APP_CREATE.check_db_host();
            if(!flag){return false;}
            flag = APP_CREATE.check_db_port();
            if(!flag){return false;}
            flag = APP_CREATE.check_db_username();
            if(!flag){return false;}
            // 后台保存
            var app_code = $("#app_code_id").val();
           var modify_app_url = BLUEKING.config.paas_host() +'app/modify/' +app_code + '/';

           $.ajax({
              type: 'POST',
              url: modify_app_url,
              data: {
                   'operate': 'db',
                   'db_type': $("#db_type_id").val(),
                   'db_host': $.trim($("#db_host").val()),
                   'db_port': $.trim($("#db_port").val()),
                   'db_username': $.trim($("#db_username").val()),
                   'db_password': $.trim($("#db_password").val()),
               },
              success: function(data){
                 flag = data.result;
                 if(!flag){
                     $('#tip_db').html(data.msg);
                 }
              },
              dataType: 'json',
              async: false,
            });

           return flag;
        },
        // 获取应用访问地址信息
        get_access_info:function(app_code){
            var url = BLUEKING.config.paas_host() + "app/status/"+app_code+"/";
            $.get(url, {}, function(res){
                app_test_url = res.app_test_url;
                app_prod_url = res.app_prod_url;
                if(res.result == 1 || res.result == 2){
                    $("#test_access_span").html( '<a href="'+app_test_url+'" target="_blank" >'+app_test_url+'</a>');
                }else{
                  $("#test_access_span").html('<span data-toggle="tooltip" data-placement="top" title=' + gettext('"应用未提测或已下架"')+ '>'+app_test_url+'</span>');
                }

                if(res.result == 1 || res.result == 3){
                    $("#prod_access_span").html( '<a href="'+app_prod_url+'" target="_blank" >'+app_prod_url+'</a>');
                }else{
                    $("#prod_access_span").html('<span data-toggle="tooltip" data-placement="top" title=' + gettext('"应用未上线或已下架"' )+ '>'+app_prod_url+'</span>');
                }
            }, 'json');
        },
        // 获取集成应用访问地址信息
        get_tpapp_access_info:function(app_code){
            var url = BLUEKING.config.paas_host() + "app/status/"+app_code+"/";
            var app_url = window.location.protocol + "//" + BLUEKING.BK_HOST() + "/console/?app=" + app_code;
            $.get(url, {}, function(res){
                if(res.result == 1 || res.result == 3){
                  $("#prod_access_span").html( '<a href="'+app_url+'" target="_blank" >'+app_url+'</a>');
                }else{
                  $("#prod_access_span").html('<span data-toggle="tooltip" data-placement="top" title=' + gettext('"应用未上线或已下架"')+ '>'+app_url+'</span>');
                }
            }, 'json');
        },
        // 激活码申请流程
        show_deploy_apply_info:function(){
          // 判断在应用创建还是基本信息修改页面
          is_base_info = $("#app_code_id").length;
          if(is_base_info == 1){
            var app_code = $("#app_code_id").val();
          }else{
            var app_code = $("#code").val();
          }
          var url = BLUEKING.config.paas_host() +'app/show_apply_process/';
          $.get(url, {
            'is_base_info': is_base_info,
            'app_code': app_code
          }, function(data){
            art.dialog({id: 'apply_tips', width: 700, title: gettext('激活码申请流程'),lock: true,content: data});
          })
        },
        // 保存桌面信息
        save_desktop_info: function(){
            // 验证前台输入
            var flag = false
            flag = APP_CREATE.check_window_width_height();
            if(!flag){return false;}
             // 后台保存
             var app_code = $("#app_code_id").val();
             var modify_app_url = BLUEKING.config.paas_host() +'app/modify/' +app_code + '/';

             $.ajax({
                type: 'POST',
                url: modify_app_url,
                data: {
                     'operate': 'desktop',
                     'width': $.trim($("#width").val()),
                     'height': $.trim($("#height").val()),
                     'open_mode': $.trim($("#open_mode_choices").val()),
                 },
                success: function(data){
                  flag = data.result;
                  if(!flag){
                       $('#tip_desktop').html(data.msg);
                   }
                },
                dataType: 'json',
                async: false,
              });

             return flag;
        }
    }
})()
//页面元素绑定事件
// 我的应用页面
$("#set_hide_outline").on('change', APP_LIST.search_app);
$("#j_display_all_app").on('click', APP_LIST.search_app);
$("#close_span").on('click', APP_LIST.clear_search_input);
$("#search_app").keyup(function(e){
    var search_val = $.trim($("#search_app").val());
    if(search_val){
          $("#close_span").css('display', '');
        }else{
              $("#close_span").css('display', 'none');
       }
      // 回车事件
      if(e.keyCode=='13'){
        $('#j_display_all_app').click();
      }
});
//  创建应用 & 基本信息 输入元素onblur事件
$("input[name='code']").on('blur', APP_CREATE.check_app_code);
$("input[name='name']").on('blur', APP_CREATE.check_app_name);
$("input[name='introduction']").on('blur', APP_CREATE.check_introduction);
$("input[name='vcs_url']").on('blur', APP_CREATE.check_vcs_url);
$("input[name='vcs_username']").on('blur', APP_CREATE.check_vcs_username);
$("input[name='vcs_password']").on('blur', APP_CREATE.check_vcs_password);
// SaaS应用基本信息页面
$("input[name='db_host']").on('blur', APP_CREATE.check_db_host);
$("input[name='db_port']").on('blur', APP_CREATE.check_db_port);
$("input[name='db_username']").on('blur', APP_CREATE.check_db_username);
// 集成应用（第三方系统）页面基本信息
$("input[name='external_url']").on('blur', APP_CREATE.check_external_url);
// 取消按钮事件
$(".can_a").click(function(){
    $(this).hide();
    $(this).next('.operate').attr({"data": "0"});
    $(this).next('.operate').html(gettext("编辑"));
    var cur_class = $(this).next('.operate').attr('edit-class');
    if(cur_class=='desktop'){$(".desktop_wh_px").show();}
    // 更新输入选项
    $(".col_main ."+cur_class).each(function(){
        var cur_value = $(this).text();
        $(this).show();
        $(this).prev('.app-edit').hide();
        $(this).parents('.app-info').find('.app-info-tips').text('');
        // 密码不显示明文
        if($(this).attr('id')=='vcs_password_value'){
          $(".password_show").show();
          $(".password_show").attr('data', '0');
          $(".password_show").attr('title', gettext('显示密码'));
          $(".password_show").html('<i class="bk-icon icon-eye t_b t_s12" style="transform: scale(0.8,0.8);"></i>');
          $(this).prev('.app-edit').val('');
        }else{
          $(this).prev('.app-edit').val(cur_value);
        }
    });
})
// // 编辑、保存按钮事件
$(".operate").click(function(){
    // 当前按钮状态
    var stat = $(this).attr("data");
    var cur_class = $(this).attr('edit-class');
    // 编辑状态
    if(stat=='0'){
        // 更改状态
        $(this).attr({"data": "1"});
        $(this).html(gettext("保存"));
        $(this).prev('.can_a').show();
        // 隐藏text值
        $(".col_main ."+cur_class).hide();
          // 显示input、text等输入选项
        $("."+cur_class).prev('.app-edit').show();
        switch (cur_class){
            case 'base':
                $("#app_tags_div").show();
                break;
            case 'vcs':
                $("."+cur_class).prev('.app-edit').css('display', 'inline-block');
                $(".password_show").hide();
                break;
            case 'db':
                $("."+cur_class).prev('.app-edit').css('display', 'inline-block');
                $(".password_show").hide();
                break;
            case 'desktop':
                $(".desktop_wh_px").hide();
                break;
        }
    }else{
        var op_flag = false;
        switch (cur_class){
            case 'base':
                op_flag = APP_INFO.save_base_info();
                break;
            case 'introduction':
                op_flag = APP_INFO.save_introduction();
                break;
            case 'vcs':
                op_flag = APP_INFO.save_vcs();
                break;
            case 'db':
                op_flag = APP_INFO.save_db_info();
                break;
            case 'desktop':
                op_flag = APP_INFO.save_desktop_info();
                break;
        }
        // 保存成功操作
        if(op_flag){
            $(this).attr({"data": "0"});
            $(this).html(gettext("编辑"));
            $(this).prev('.can_a').hide();
            // 隐藏input、text等输入选项
            $("."+cur_class).prev('.app-edit').hide();
            if(cur_class=='base'){
              $("#app_tags_div").hide();
            }
            if(cur_class=='desktop'){$(".desktop_wh_px").show();}
            // 更新输入选项
            $(".col_main ."+cur_class).each(function(){
                var cur_value = $.trim($(this).prev('.app-value').val());

                $(this).show();
                // 密码不显示明文
                if($(this).attr('id')=='vcs_password_value'){
                  $(this).html('******');
                  $(this).prev('.app-value').val('')
                  $(".password_show").show();
                  $(".password_show").attr('data', '0');
                  $(".password_show").attr('title', gettext('显示密码'));
                  $(".password_show").html('<i class="bk-icon icon-eye t_b t_s12" style="transform: scale(0.8,0.8);"></i>');
                }else if($(this).attr('id')=='app_tags_dis'){
                  $(this).text($.trim($("#app_tags option:selected").text()));
                }else if($(this).attr('id')=='open_mode_dis'){
                  $(this).text($.trim($("#open_mode_choices option:selected").text()));
                } else {
                  $(this).text($.trim(cur_value));
                }
            });
        }
    }
})
// 代码仓库提示
$("input[name='vcs_type']").click(function(){
  var type = $(this).val();
  if(type=='0'){
    $("#vcs_url_help").html(gettext('支持以下协议：http(s)://, git://'));
    $("#vcs_type_help").html(gettext('通过Git方式获取应用代码'));
    $("#cur_protocol").val('');
    $("#vcs_text").text('Git');
  }else{
    $("#vcs_url_help").html(gettext('支持以下协议：http(s)://, svn://<br>请确保 <code>requirements.txt</code> 文件在该目录下'));
    $("#vcs_type_help").html(gettext('通过SVN方式获取应用代码'));
    $("#cur_protocol").val('svn://');
    $("#vcs_text").text('SVN');
  }
})
// 显示/ 隐藏 代码仓库密码
$(".password_show").click(function(){
  var data = $(this).attr('data');
  if(data=='0'){
    $(this).attr('data', '1');
    // 获取用户密码
    var vcs_password = APP_INFO.get_vcs_password();
    $("#vcs_password_value").html(vcs_password);
    $(this).attr('title', gettext('隐藏密码'));
    $(this).html('<i class="bk-icon icon-eye-slash t_b t_s12" style="transform: scale(0.8,0.8);"></i>');
  }else{
    $("#vcs_password_value").html('******');
    $(this).attr('data', '0');
    $(this).attr('title', gettext('显示密码'));
    $(this).html('<i class="bk-icon icon-eye t_b t_s12" style="transform: scale(0.8,0.8);"></i>');
  }
})
