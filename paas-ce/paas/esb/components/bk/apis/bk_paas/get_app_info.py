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
from .toolkit import configs


class GetAppInfo(Component):
    """
    apiLabel {{ _("获取应用信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取应用信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | target_app_code |  string    | {{ _("否") }}     | {{ _("目标蓝鲸应用ID，多个以英文逗号分隔，为空则表示所有应用") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "target_app_code": "bk_test,esb_test",
    }
    ```
    ### {{ _("返回结果示例") }}
    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "app_code": "bk_test",
                "app_name": "BKTest"
            },
            {
                "app_code": "esb_test",
                "app_name": "ESBTest"
            }
        ]
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        target_app_code = ListField(label='target app_code', required=False)

        def clean(self):
            return {
                'target_app_code': ';'.join(self.cleaned_data['target_app_code'])
            }

    def handle(self):
        self.response.payload = self.outgoing.http_client.get(
            configs.host,
            '/paas/api/app_info/',
            params=self.form_data,
            headers=configs.headers,
        )
