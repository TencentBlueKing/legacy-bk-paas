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


class UpdateHostInfo(Component):
    """
    apiLabel {{ _("更新主机属性") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("更新主机属性") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | host_id   |  int       | {{ _("是") }}     | {{ _("主机ID") }} |
    | std_property |  dict   | {{ _("否") }}     | {{ _("标准属性数据, 数组格式；允许修改的标准属性：HostName, BakOperator, Operator, Description, Source, OSName, DeviceClass, Mem, Cpu, osType") }} |
    | cus_property |  dict   | {{ _("否") }}     | {{ _("自定义属性") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "host_id": 12345,
        "std_property": {
            "HostName": "hostname",
            "OSName": "linux",
            "Cpu": 4,
        }
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
    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        host_id = forms.IntegerField(label='host ID', required=True)
        std_property = TypeCheckField(label='standard property', promise_type=dict, required=False)
        cus_property = TypeCheckField(label='custom property', promise_type=dict, required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationID': data['app_id'],
                'HostID': data['host_id'],
                'stdProperty': json.dumps(data['std_property']),
                'cusProperty': json.dumps(data['cus_property']),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/host/updateHostInfo',
            data=self.form_data,
        )
