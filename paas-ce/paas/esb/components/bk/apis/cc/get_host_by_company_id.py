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


class GetHostByCompanyId(Component):
    """
    apiLabel {{ _("根据开发商ID、子网ID、主机IP获取主机信息") }}
    apiMethod GET

    ### 功能描述

    {{ _("根据开发商ID、子网ID、主机IP获取主机信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | company_id|  int       | {{ _("是") }}     | {{ _("开发商ID") }} |
    | ip        |  string    | {{ _("是") }}     | {{ _("主机ip") }} |
    | plat_id   |  int       | {{ _("是") }}     | {{ _("子网ID") }} |


    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "company_id": 0,
        "ip": "10.0.0.1",
        "plat_id": 1,
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "ApplicationName": "Test",
            "ModuleName": "Test",
            "BakOperator": "admin",
            "SetName": "Test",
            "Operator": "admin",
            "SetID": "3",
            "ApplicationID": "1",
            "ModuleID": "3"
        }
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        company_id = forms.IntegerField(label='company ID', required=True)
        ip = forms.CharField(label='server ip', required=True)
        plat_id = forms.IntegerField(label='subnet ID', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'companyId': data['company_id'],
                'ip': data['ip'],
                'platId': data['plat_id'],
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/App/getHostAppByCompanyId',
            data=self.form_data,
        )
