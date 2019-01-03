# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs, tools


class GetAppInfo(Component):
    """
    apiLabel {{ _("获取应用信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取应用信息，支持批量获取") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | target_app_code |  string    | {{ _("否") }}     | {{ _("target_app_code 表示应用 ID，多个 ID 以英文分号分隔，target_app_code 为空则表示所有应用") }} |
    | fields          |  string    | {{ _("否") }}     | {{ _('fields 需要返回的字段，多个字段以英文分号分割，如果不传或传入 ""，则返回应用的 bk_app_code、bk_app_name 字段。可选的字段有：bk_app_code（应用ID），bk_app_name（应用名），introduction（应用简介），creator（创建者），developer（开发人员）') }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "target_app_code": "bk_test;esb_test",
    }
    ```
    ### {{ _("返回结果示例") }}
    ```python
    {
        "result": true,
        "code": 0,
        "message": "",
        "data": [
            {
                "bk_app_code": "bk_test",
                "bk_app_name": "BKTest"
            },
            {
                "bk_app_code": "esb_test",
                "bk_app_name": "ESBTest"
            }
        ]
    }
    ```
    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        target_app_code = ListField(label='target app code', required=False)
        fields = ListField(label='fields', required=False)

        def clean(self):
            return {
                'target_app_code': ';'.join(self.cleaned_data['target_app_code']),
                'fields': ';'.join(self.cleaned_data['fields'])
            }

    def handle(self):
        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.get(
            configs.host,
            '/paas/api/v2/app_info/',
            params=self.form_data,
        )
