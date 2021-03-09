// AJAX请求，获取csrftoken
$('html').ajaxSend(function(event, xhr, settings) {
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
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
    	// 引用jquery cookie使用
    	//var csrftoken = $.cookie('bkcsrftoken');
        // Only send the token to relative URLs i.e. locally.
    	var csrftoken = getCookie('bk_csrftoken');
    	xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
});
