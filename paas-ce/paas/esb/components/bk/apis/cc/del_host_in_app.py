# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class DelHostInApp(Component):
    """
    apiLabel {{ _("从业务空闲机集群中删除主机") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("从业务空闲机集群中删除主机，如果主机在当前业务下不存在，也提示不在空闲机集群的错误信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | host_id   |  int       | {{ _("是") }}     | {{ _("主机ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "host_id": 12345
    }
    ```
    ### {{ _("返回结果参数说明") }}

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
        host_id = forms.IntegerField(label='host ID', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationID': data['app_id'],
                'HostID': data['host_id'],
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/host/delHostInApp',
            data=self.form_data,
        )
