// 应用列表页面相关
PAAS_LIST = (function(){
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
          }
        },
        // 查询App列表
        // note:需要在之前引用 pagination.js 文件
        search_app:function(){
          var keyword = $.trim($("#search_app").val());
          // check keyword
          if (keyword.indexOf('&') != -1) {
            art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: true,content: gettext('错误的搜索参数! 参数中不能包含符号[&]')});
            return
          }

          //获取当前tabid
          var status = $('#status').val();
          var hide_outline = $('#set_hide_outline').val();
          //分页请求
          var opt={
            url:BLUEKING.config.paas_host() +'tpapp/query_list/?keyword='+keyword+'&'+'hide_outline='+hide_outline+'&',
            items_per_page:8,
            current_page:1,
            callback:PAAS_LIST._callback_fun,
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
})()
// 应用列表页面
$("#set_hide_outline").on('change', PAAS_LIST.search_app);
$("#j_display_all_app").on('click', PAAS_LIST.search_app);
$("#close_span").on('click', PAAS_LIST.clear_search_input);
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
