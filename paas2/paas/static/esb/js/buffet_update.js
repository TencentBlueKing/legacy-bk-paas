$(function() {
    var kv_extra_headers = new KeyValueInputPair({
        container: $('#pair-extra-headers'),
        label: gettext('请求额外头信息'),
        initial: current_conf.extra_headers,
    });
    kv_extra_headers.initialize();

    $('form[name="form-apply"]').bind('submit', function(event) {
        $('#id_extra_headers').val(JSON.stringify(kv_extra_headers.get_value()));
    });

    $('button.cancel').bind('click', function() {
       window.location.href = UrlMaker.make('buffet_list');
    });
    // 添加系统
    var url_add_system = UrlMaker.make('system_add');
    add_system(url_add_system, current_conf.csrf_token, $('#id_system'));

});
