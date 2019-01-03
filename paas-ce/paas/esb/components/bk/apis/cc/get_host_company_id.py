# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.forms import BaseComponentForm, ListField
from components.component import Component
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetHostCompanyId(Component):
    """
    apiLabel {{ _("获取主机开发商") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取主机开发商") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | ips       |  string    | {{ _("是") }}     | {{ _("主机内网IP，多个以逗号分隔") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "ips": "10.0.0.1,10.0.0.2",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "10.0.0.1": {
                "102": {
                    "CompanyID": "0",
                    "AssetID": "",
                    "Region": "",
                    "Owner": "CompanyName",
                    "PlatID": "1",
                    "ApplicationID": "1"
                }
            },
            "10.0.0.2": {
                "102": {
                    "CompanyID": "0",
                    "AssetID": "",
                    "Region": "",
                    "Owner": "CompanyName",
                    "PlatID": "1",
                    "ApplicationID": "1"
                }
            }
        }
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        ips = ListField(label=u'主机内网IP', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'Ips': ','.join(data['ips']),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/Host/getCompanyIdByIps',
            data=self.form_data,
        )
