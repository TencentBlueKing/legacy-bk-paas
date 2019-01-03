/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
            art.dialog({id: 'bktips',width: 300,icon: 'warning',lock: true,content: '错误的搜索参数! 参数中不能包含符号[&]'});
            return
          }
          //获取当前tabid
          var status = $('#status').val();
          var hide_offline = $('#set_hide_offline').val();
          //分页请求
          var opt={
            url:BLUEKING.config.paas_host() +'saas/list/query/?keyword='+keyword+'&'+'hide_offline='+hide_offline+'&',
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
$("#set_hide_offline").on('change', PAAS_LIST.search_app);
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
