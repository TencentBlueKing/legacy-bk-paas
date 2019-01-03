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
from .toolkit import tools, configs


class GetAppByUserRole(Component):
    """
    apiLabel {{ _("根据用户角色查询用户业务") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("根据用户角色查询用户业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | user_role |  string    | {{ _("是") }}     | {{ _("用户角色，多个以逗号分隔，可选值为：Maintainers,ProductPm,Cooperation等") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "user_role": "Maintainers,ProductPm",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "ProductPm": [
                {
                    "ApplicationName": "Test",
                    "ApplicationID": "1",
                    "DeptName": "Test",
                    "Owner": "bk"
                }
            ],
            "Maintainers": [
                {
                    "ApplicationName": "Test",
                    "ApplicationID": "1",
                    "DeptName": "Test",
                    "Owner": "bk"
                }
            ],
            "Cooperation": []
        },
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        user_role = ListField(label='user role', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'roleList': ','.join(data['user_role']),
            }

    def handle(self):
        # 获取当前操作者
        self.form_data['uin'] = self.current_user.username

        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/User/getUserRoleApp',
            data=self.form_data,
        )
