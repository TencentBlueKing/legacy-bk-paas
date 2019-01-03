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


class GetAppList(Component):
    """
    apiLabel {{ _("查询业务列表") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务列表") }}

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
        "data": [
            {
                "ApplicationName": "Test",
                "Type": "0",
                "Description": "",
                "BusinessDeptName": "",
                "Creator": "admin",
                "Default": "0",
                "ApplicationID": "2",
                "Level": "3",
                "Display": "1",
                "Source": "",
                "GroupName": "",
                "Maintainers": "admin",
                "CompanyID": "0",
                "Owner": "CompanyName",
                "ProductPm": "admin",
                "LifeCycle": "公测",
                "LastTime": "2016-03-25 04:02:05",
                "DeptName": "CompanyName",
                "CreateTime": "2016-03-18 13:08:19"
            }
        ]
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    def handle(self):
        client = tools.CCClient(self)
        client.verify_app_can_use_superadmin()
        result = client.post_request(
            self.host,
            '/api/App/getapplist',
        )
        self.response.payload = result
