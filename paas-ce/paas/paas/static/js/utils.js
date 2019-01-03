/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
// utils.js
UTILS = (function(){
  return {
            // 是否为整数
            isInt: function(value) {
                      return !isNaN(value) &&
                            parseInt(Number(value)) == value &&
                            !isNaN(parseInt(value, 10));
            },
            // 计算字符串长度
            chkstrlen: function(str) {
                          var strlen = 0;
                          var i;
                          for(i=0; i<str.length; i++)
                          {
                            strlen+=1;
                          }
                          return strlen;
                      },

              // 验证是否包含中文字母
              chkstrch: function(field){
                          with(field)
                          {
                            for(var i=0; i<value.length; i++)
                            {
                              if(value.charCodeAt(i)>255){
                                $('#tip_code').attr('class', 'ml5');
                                $('#tip_code').attr('style', 'color:#C09853');
                                //$('#tip_code').html("不能包含中文字符!");
                                $('#tip_code').html('<span class="error ml5">不能包含中文字符!</span>');
                                return false;
                              }
                            }
                          }
                          return true;
                        },


  };
})();
