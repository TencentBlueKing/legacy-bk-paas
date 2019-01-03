/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function() {
    $('#id_component_system').bind('change', function() {
        var component_system_name = $(this).find('option:selected').text();

        var component_system_name = component_system_name.match(/^\[(.*?)\]/);
        if (component_system_name) {
            component_system_name = component_system_name[1];
        } else {
            component_system_name = '';
        }

        var id_component_codename = $('#id_component_codename');
        var component_codename = id_component_codename.val();
        component_codename = component_codename.split('.');
        if (component_codename.length == 3) {
            component_codename[0] = 'generic'
            component_codename[1] = component_system_name.toLowerCase();
            component_codename = component_codename.join('.');
        } else {
            component_codename = 'generic.' + component_system_name.toLowerCase() + '.';
        }
        id_component_codename.val(component_codename);
    });

    $('#id_rate_limit_required').bind('change', function() {
        if ($(this).is(":checked")) {
            $('.rate-limit-config-container').show();
        } else {
            $('.rate-limit-config-container').hide();
        };
    });
});
