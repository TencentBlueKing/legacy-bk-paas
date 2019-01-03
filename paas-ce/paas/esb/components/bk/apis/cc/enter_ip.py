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


class EnterIp(Component):
    """
    apiLabel {{ _("导入主机到业务") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("将主机导入到业务下面。如果业务不存在，将导入到资源池中，如果主机已经存在，将会删除原有主机与模块的关系") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | ips       |  string    | {{ _("是") }}     | {{ _("IP地址，多个用英文逗号分隔") }} |
    | hostname  |  string    | {{ _("否") }}     | {{ _("主机名, 多个用英文逗号分隔") }} |
    | app_name  |  string    | {{ _("否") }}     | {{ _("业务名") }} |
    | set_name  |  string    | {{ _("否") }}     | {{ _("集群名") }} |
    | module_name |  string  | {{ _("否") }}     | {{ _("模块名") }} |
    | os_type   |  string    | {{ _("否") }}     | {{ _("操作系统类型，linux或windows") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "ips": "10.10.10.10,10.10.10.11",
        "hostname": "test",
        "app_name": "test",
        "set_name": "test",
        "module_name": "test",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": null
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        ips = ListField(label='ip address', required=True)
        hostname = ListField(label='hostname', required=False)
        app_name = forms.CharField(label='business name', required=False)
        set_name = forms.CharField(label='set name', required=False)
        module_name = forms.CharField(label='module name', required=False)
        os_type = forms.CharField(label='OS type', required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                'ip': ','.join(data['ips']),
                'hostname': ','.join(data['hostname']),
                'appName': data['app_name'],
                'setName': data['set_name'],
                'moduleName': data['module_name'],
                'osType': data['os_type'],
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/host/enterIp',
            data=self.form_data,
        )
