# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.forms import BaseComponentForm, DefaultBooleanField
from components.component import Component
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetAppByUser(Component):
    """
    apiLabel {{ _("查询用户有权限的业务") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询用户有权限的业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | filter_only |  bool    | {{ _("否") }}     | {{ _("是否不显示已经停止运行的业务，默认为False") }} |

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
                "GroupName": "",
                "Description": "",
                "BusinessDeptName": "",
                "Creator": "admin",
                "Default": "0",
                "ApplicationID": "2",
                "DeptName": "CompanyName",
                "Level": "3",
                "LifeCycle": "公测",
                "Source": "",
                "Maintainers": "admin",
                "CreateTime": "2016-08-10 20:43:38",
                "CompanyID": "0",
                "Owner": "CompanyName",
                "ProductPm": "admin",
                "LastTime": "2016-08-10 20:43:38",
                "Type": "0",
                "Display": "1"
            }
        ],
    }
    ```

    ### {{ _("返回结果参数说明") }}

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | Default   | string   | {{ _("为1表示系统默认创建业务") }} |

    ### {{ _("返回结果示例") }} -- {{ _("失败") }}

    ```python
    {
        "code": "50000",
        "error": {
            "error_data": {
                "api_spec": {
                    "msg": "only right to app",
                    "extmsg": "{{ _('没权利访问业务') }}",
                    "code": "0006"
                }
            }
        },
        "result": false,
        "request_id": "bb8e27bbd86e4802ada9027e2d933cc1",
        "message": "{{ _('没权利访问业务') }}",
        "data": null
    }
    ```

    #### Error

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | error    | dict   | {{ _("错误详情，api_spec为配置平台接口的错误信息") }} |
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        filter_only = DefaultBooleanField(
            label='display the business that has stopped running or not', default=False, required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                'filterOnly': data['filter_only'],
            }

    def handle(self):
        self.form_data.update({
            'userName': self.current_user.username
        })

        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/App/getappbyuin',
            data=self.form_data,
        )
