# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from django import forms

from common.forms import BaseComponentForm, ListField, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class AddModule(Component):
    """
    apiLabel {{ _("新建模块") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("新建模块") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | set_id    |  int       | {{ _("是") }}     | {{ _("集群ID") }} |
    | module_name |  string  | {{ _("否") }}     | {{ _("模块名，多个用英文逗号分隔") }} |
    | operator  |  string    | {{ _("否") }}     | {{ _("操作人") }} |
    | bak_operator | string  | {{ _("否") }}     | {{ _("备份操作人") }} |
    | module_type | int      | {{ _("否") }}     | {{ _("模块类型，1: 普通, 2: 数据库") }} |
    | properties | dict      | {{ _("否") }}     | {{ _("模块属性，自定义属性用customerxx来修改") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "set_id": 10,
        "module_name": "test1,test2",
        "module_type": 1,
        "operator": "user1",
        "bak_operator": "user2",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {},
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        set_id = forms.IntegerField(label='set ID', required=True)
        module_name = ListField(label='module name', required=False)
        operator = forms.CharField(label='operator', required=False)
        bak_operator = forms.CharField(label='backup operator', required=False)
        module_type = forms.IntegerField(label='module type', required=False)
        properties = TypeCheckField(label='module properties', promise_type=dict, required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationID': data['app_id'],
                'SetID': data['set_id'],
                'ModuleName': ','.join(data['module_name']),
                'Operator': data['operator'],
                'BakOperator': data['bak_operator'],
                'ModuleType': data['module_type'],
                'properties': json.dumps(data['properties']),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/module/addModule',
            data=self.form_data,
        )
