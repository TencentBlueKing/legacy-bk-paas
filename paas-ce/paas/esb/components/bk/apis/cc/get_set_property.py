# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from components.component import Component
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetSetProperty(Component):
    """
    apiLabel {{ _("获取所有 set 属性") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取所有 set 属性") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "SetEnviType": [
                {
                    "Property": "2",
                    "value": "test"
                }
            ],
            "SetServiceStatus": [
                {
                    "Property": "0",
                    "value": "test"
                }
            ]
        }
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    def handle(self):
        client = tools.CCClient(self)
        result = client.post_request(
            self.host,
            '/api/Set/getsetproperty',
        )
        self.response.payload = result
