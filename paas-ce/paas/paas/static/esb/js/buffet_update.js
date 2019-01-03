/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
