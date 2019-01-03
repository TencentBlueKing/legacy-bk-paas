/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var timeout_event;
var execute_cnt = 0;
// 查询绑定状态
function get_bind_status(callback){
    execute_cnt += 1;
	$.get(site_url + 'console/user_center/weixin/get_bind_status/', function(res){
		if(res.result){
			callback && callback();
		}else{
		    // 小于半个小时，就间隔1.5秒查询，大于则以 （execute_cnt-120）* 1.5秒查询
            var execute_time = 1500;
		    if(execute_cnt > 120){
                execute_time = (execute_cnt - 120) * 1500;
            }
			timeout_event = setTimeout(function(){
			    get_bind_status(callback);
            }, execute_time);
		}
	});
}

$("#weixin_action").on('click', '.unbind_weixin', function(){
    $.ajax({
        method: "post",
        dataType: "json",
        url: site_url + 'console/user_center/weixin/unbind_wx_user_info/',
        async: false,
        success: function (res) {
            if(res.result) {
                location.reload();
            }else{
                console.log(res.message);
            }
        }
    });
});

$("#weixin_action").on('click', '.bind_qy_weixin', function(){
    clearTimeout(timeout_event);
    execute_cnt = 0;
    // 后台请求登录URL
    $.ajax({
        method: "get",
        dataType: "json",
        url: site_url + 'console/user_center/weixin/qy/get_login_url/',
        async: false,
        success: function (res) {
            if (res.result) {
                window.open(res.url, '_blank');
                get_bind_status(function(){
                    location.reload();
                });
            }
        }
    });
});

$("#weixin_action").on('click', '.bind_mp_weixin', function(){
    clearTimeout(timeout_event);
    execute_cnt = 0;
    var dialog = new bkDialog({
      type: 'default',
      width: 400,
      padding: 20,
      content: '<div id="qrcode_div"><img class="loading_img" src="' + static_url + 'home/user_center/img/loading_2_36x36.gif"></div>',
      hasHeader: false,
      closeIcon: true,
      onClose: function(){
          clearTimeout(timeout_event);
      }
    });
    dialog.show();
	$.getJSON(site_url + "console/user_center/weixin/mp/get_qrcode/", function(res) {
		if(res.result){
            $("#qrcode_div").html('<img class="code_img" src="' + res.url + '">');
			get_bind_status(function(){
                location.reload();
            });
		}else{
		    console.log(res.message);
		}
	});
});
