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

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component
from .toolkit import tools, configs


class CreateModule(Component):
    """
    apiLabel {{ _("创建模块") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("创建模块") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id      | int     | {{ _("是") }}     | {{ _("业务ID") }} |
    | bk_set_id      | int     | {{ _("是") }}     | {{ _("集群id") }} |
    | data           | dict    | {{ _("是") }}     | {{ _("业务数据") }} |

    #### data

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_parent_id      | int     | {{ _("是") }}     | {{ _("父实例节点的ID，当前实例节点的上一级实例节点，在拓扑结构中对于module一般指的是set的bk_set_id") }} |
    | bk_module_name    | string  | {{ _("是") }}     | {{ _("模块名") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_biz_id": 1,
        "bk_set_id": 10,
        "data": {
            "bk_parent_id": 10,
            "bk_module_name": "test"
        }
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "",
        "data": {
            "bk_module_id": 10
        }
    }
    ```
    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        bk_set_id = forms.IntegerField(label='set id', required=True)
        data = TypeCheckField(label='data', promise_type=dict, required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data['data']['bk_supplier_account'] = data['bk_supplier_account']
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/module/{bk_biz_id}/{bk_set_id}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
