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
function refresh_token(){
    var csrftoken = getCookie('bklogin_csrftoken');
    $('input[name="csrfmiddlewaretoken"]').val(csrftoken);
    return true;
}

$(document).ready(function(){
    // 中英文按钮切换
    $('.language-switcher img').click(function() {
       $(this).toggleClass('en');
       var language = 'zh-hans';
       if ($(this).hasClass('en')) {
            language = 'en';
       }
       $("#language-form select").val(language);
       setTimeout(function(){
           $("#language-form").submit();
       }, 500);

    });

    // 点击查看协议
    $('.action .protocol-btn').click(function(event) {
        $('.protocol-pop').show();
    });

    // 关闭协议弹窗
    $('.protocol-pop .close').click(function(event) {
        $('.protocol-pop').hide();
    });

    $('.consent-content .consent-btn').click(function(){
        $('.protocol-pop').hide();
    });


    // 判断当前的浏览器是谷歌 及证书验证过期
    $('#close-chrome').click(function() {
        $('.is-chrome').hide();
    });
    $('#close-certificate').click(function() {
         $('.is-certificate').hide();
    });

    var is_license_ok = $(".is-certificate").attr('data-ok') != '0';

    //  证书过期验证
    if (!is_license_ok) {
        $('.is-certificate').show();
        $('.form-login').addClass('certificate-expired');
        $('.form-login').find('.group-control input').attr('disabled','disabled');
        $('.btn-content').find('.login-btn').attr('disabled','disabled');

    }

    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    // 当前不是谷歌浏览器  并且证书未过期
    if (!isChrome && is_license_ok) {
        $('.is-chrome').show();
    } else {
        $('.is-chrome').hide();
    }


    // 支持多域
    var domainList = [];

    var domainListStr = $('#domains').val()
    if (domainListStr != "") {
      domainList = domainListStr.split(";")
    }

    var userDomainList = $('#user-domain-list')

    function hideUserDomainList () {
      setTimeout(function () {
        userDomainList.html('').hide()
      }, 200)
    }

    // 提交
    var isUserDomainEnter = false;
    $('#login-form').on('submit', function (event) {
      refresh_token();
      if (isUserDomainEnter) {
        return false;
      } else {
        return true;
      }
    });

    $('#login-btn').on('click', function () {
      $('#login-form').submit();
    });

    $(document).on('click', function () {
      hideUserDomainList()
    });



    // 用户选择时处理
    userDomainList.on('click', function (event) {
      return false
    })
    userDomainList.on('click', 'li', function (event) {
      var target = $(event.target)
      $('#user').val(target.text())
      $('#password').focus();
      hideUserDomainList()
      return false
    })

    // 监听用户输入
    $('#password').on('keyup', function (event) {
      // enter
      if (event.keyCode === 13) {
        $('#login-form').submit();
      }
    });

    $('#user').on('keyup', function (event) {
      var keyCode = event.keyCode;
      switch (keyCode) {
        // arrow up
        case 38:
          var selectedItem = userDomainList.find('.selected');
          if (!selectedItem.length) {
            userDomainList.find('li:last').addClass('selected')
          } else {
            selectedItem.removeClass('selected');
            var prev = selectedItem.prev();
            if (prev.length) {
              prev.addClass('selected');
            }
          }
          break;

        // arrow down
        case 40:
          var selectedItem = userDomainList.find('.selected');
          if (!selectedItem.length) {
            userDomainList.find('li:first').addClass('selected')
          } else {
            selectedItem.removeClass('selected');
            var next = selectedItem.next();
            if (next.length) {
              next.addClass('selected');
            }
          }
          break;

        // enter
        case 13:
          var selectedItem = userDomainList.find('.selected');
          if (selectedItem.length) {
            $('#user').val(selectedItem.text());
            isUserDomainEnter = true;
            setTimeout(function () {
              isUserDomainEnter = false;
            }, 200);
            $('#password').focus();
            hideUserDomainList();
          } else {
            $('#login-form').submit();
          }
          break;

        default:
          var value = event.target.value
          var username = value.split('@')[0];

          // var username = event.target.value.split('@')[0];
          // if (username.length >= 2) {
          if (username.length >= 2 && value.indexOf('@') > -1) {
            var domainKey = value.split('@')[1];
            var innerHtml = '';
            for (i=0; i < domainList.length; i++) {
              if (domainList[i].indexOf(domainKey) > -1) {
                var line = "<li><strong>" + username + "</strong>@" + domainList[i] + "</li>";
                innerHtml += line;
              }
            }
            // domainList.forEach(item => {
            //   innerHtml += `<li><strong>${username}</strong>@${item}</li>`;
            // })
            userDomainList.html(innerHtml).show()
          } else {
            userDomainList.hide()
          }
      }
    })

});
