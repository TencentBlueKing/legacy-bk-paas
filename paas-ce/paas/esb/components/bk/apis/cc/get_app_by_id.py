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
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import tools, configs


class GetAppById(Component):
    """
    apiLabel {{ _("查询业务信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id |  int    | {{ _("是") }}     | {{ _("业务ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 516
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
                "Creator": "2323232",
                "Default": "0",
                "ApplicationID": "51",
                "DeptName": "23223",
                "CompanyID": "6",
                "LifeCycle": "内测",
                "Source": "qcloud",
                "Maintainers": "12345",
                "CreateTime": "2015-12-17 17:12:14",
                "ProjectID": "0",
                "Owner": "232232",
                "ProductPm": "2323232",
                "Level": "3",
                "LastTime": "2016-05-16 10:27:39",
                "Type": "1",
                "Display": "1"
            }
        ]
    }
    ```

    ### {{ _("返回结果示例") }} -- {{ _("失败") }}

    ```python
    {
        "code": "50000",
        "error": {
            "error_data": {
                "api_spec": {
                }
            }
        },
        "result": false,
        "message": "{{ _('没权利访问业务') }}",
        "data": null
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.CharField(label='business ID', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationID': data['app_id'],
            }

    def handle(self):
        client = tools.CCClient(self)
        client.verify_app_can_use_superadmin()
        self.response.payload = client.post_request(
            self.host,
            '/api/App/getAppByID',
            data=self.form_data,
        )
