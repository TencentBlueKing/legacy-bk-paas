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
from common.constants import API_TYPE_Q
from components.component import Component

from .toolkit import tools, configs


class GetIpAndProxyByCompany(Component):
    """
    apiLabel {{ _("查询业务下IP及ProxyIP") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务下IP及ProxyIP") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id |  int    | {{ _("是") }}     | {{ _("业务ID") }} |
    | plat_id |  int    | {{ _("是") }}     | {{ _("子网ID") }} |
    | ip_list |  string    | {{ _("是") }}     | {{ _("内网IP列表，多个以逗号分隔") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 2,
        "plat_id": 1,
        "ip_list": "10.0.0.1,10.0.0.2"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "proxy_list": [],
            "ip_list": [
                "10.0.0.1",
                "10.0.0.2",
            ],
            "invalid_ips": []
        }
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        plat_id = forms.IntegerField(label='subnet ID', required=True)
        ip_list = ListField(label='ip list', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'appId': data['app_id'],
                'platId': data['plat_id'],
                'ipList': ','.join(data['ip_list']),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/Host/getIPAndProxyByCompany',
            data=self.form_data,
        )
