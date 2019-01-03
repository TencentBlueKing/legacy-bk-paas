# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class UpdateHostModule(Component):
    """
    apiLabel {{ _("修改主机模块") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("修改主机模块") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | ip        |  string    | {{ _("是") }}     | {{ _("内网IP") }} |
    | plat_id   |  int       | {{ _("是") }}     | {{ _("子网ID") }} |
    | dst_module_id |  string    | {{ _("是") }}     | {{ _("目标模块ID，多个以逗号分隔") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 12,
        "ip": "xxx.xxx.xxx.xxx",
        "plat_id": 1,
        "dst_module_id": "1232"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "data": null,
        "message": ""
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        ip = forms.CharField(label='intranet IP', required=True)
        plat_id = forms.IntegerField(label='subnet ID', required=True)
        dst_module_id = ListField(label='target module ID', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationID': data['app_id'],
                'ip': data['ip'],
                'platId': data['plat_id'],
                'dstModuleID': ','.join(data['dst_module_id']),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/host/updatehostmodule',
            data=self.form_data,
        )
