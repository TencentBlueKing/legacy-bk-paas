# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class UpdateHostByAppId(Component):
    """
    apiLabel {{ _("更新主机的gse agent状态") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("更新主机的gse agent状态") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id |  int    | {{ _("是") }}     | {{ _("业务ID") }} |
    | plat_id |  int    | {{ _("是") }}     | {{ _("子网ID") }} |
    | proxy_list |  array    | {{ _("是") }}     | {{ _("Proxy信息，Proxy中每项包含内容见下面参数描述") }} |

    #### proxy_list

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | inner_ip |  string    | {{ _("是") }}     | {{ _("内网IP") }} |
    | outer_ip |  string    | {{ _("否") }}     | {{ _("外网IP") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "plat_id": 1,
        "proxy_list": [
            {
                "inner_ip": "10.0.0.1",
                "outer_ip": ""
            }
        ]
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": null,
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        plat_id = forms.IntegerField(label='subnet ID', required=True)
        proxy_list = TypeCheckField(label='Proxy info', promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'appId': data['app_id'],
                'platId': data['plat_id'],
                'proxyList': json.dumps([
                    UpdateHostByAppId.ProxyForm(host).get_cleaned_data_or_error()
                    for host in data['proxy_list']
                ]),
            }

    class ProxyForm(BaseComponentForm):
        inner_ip = forms.CharField(label='intranet IP', required=True)
        outer_ip = forms.CharField(label='extranet IP', required=False)

        def clean(self):
            return {
                'InnerIP': self.cleaned_data['inner_ip'],
                'OuterIP': self.cleaned_data['outer_ip'],
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/Host/updateHostByAppId',
            data=self.form_data,
        )
