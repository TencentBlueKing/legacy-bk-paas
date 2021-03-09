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
                                $('#tip_code').html('<span class="error ml5">'+gettext('不能包含中文字符!')+'</span>');
                                return false;
                              }
                            }
                          }
                          return true;
                        },


  };
})();
