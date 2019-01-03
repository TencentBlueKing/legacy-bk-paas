# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from components.component import Component
from common.constants import API_TYPE_OP
from common.forms import BaseComponentForm

from .toolkit import tools, configs


class UpdateModuleProperty(Component):
    """
    apiLabel {{ _("修改模块属性") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("修改模块属性") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | module_ids |  string   | {{ _("是") }}     | {{ _("模块ID，多个以半角逗号分隔") }} |
    | module_name| string    | {{ _("否") }}     | {{ _("模块名称，模块ID多个时无效") }} |
    | operator  |  string    | {{ _("否") }}     | {{ _("维护人") }} |
    | bak_operator | string  | {{ _("否") }}     | {{ _("备份维护人") }} |
    | module_type  | int     | {{ _("是") }}     | {{ _("类型，包含1：普通模块 2：数据库") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "module_id": "4",
        "module_name": "test",
        "module_type": 1
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": null
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.CharField(label='business ID', required=True)
        module_ids = forms.CharField(label='module ID', required=True)
        module_name = forms.CharField(label='module name', required=False)
        operator = forms.CharField(label='operator', required=False)
        bak_operator = forms.CharField(label='backup operator', required=False)
        module_type = forms.IntegerField(label='module type', required=False)

        def clean(self):
            data = self.cleaned_data
            ret_data = {
                'ApplicationID': data['app_id'],
                'ModuleID': data['module_ids'],
                'ModuleName': data.get('module_name'),
                'Operator': data.get('operator'),
                'BakOperator': data.get('bak_operator'),
                'ModuleType': data.get('module_type')
            }
            return {key: val for key, val in ret_data.iteritems() if val or val == 0}

    def handle(self):
        client = tools.CCClient(self)
        result = client.post_request(
            self.host,
            '/api/module/editmodule',
            data=self.form_data,
        )
        self.response.payload = result
