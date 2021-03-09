/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
// /**
//  * ajax全局设置
//  */
// $.ajaxSetup({
//   //    timeout: 8000,
//   cache: false,
//   statusCode: {
//     // 401未授权
//     401: function(xhr) {
//       // 重新加载页面后跳转到登录页面，重新获取登录态
//       window.location.reload();
//       },
//       // 402 权限验证不通过
//       402:function(xhr){
//         var _src = xhr.responseText;
//         ajax_content = '<iframe name="access_control_iframe" frameborder="0" src="'+_src+'"></iframe>';
//         art.dialog({id: 'bktips'}).close();
//         art.dialog({
//             id: 'bktips',
//             title: "提示",
//             lock: true,
//             content: ajax_content
//       });
//         return;
//       },
//       500: function(xhr, textStatus) {
//         art.dialog({id: 'bktips'}).close();
//           // 异常
//           art.dialog({
//               id: 'bktips',
//               title: "提示",
//               lock: true,
//               content: "系统出现异常："+textStatus+"---"+xhr.status+'===='
//         });
//       }
//   },
// });
// AJAX请求，获取csrftoken
// AJAX请求，获取csrftoken
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
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
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            var csrftoken = getCookie('bk_csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
