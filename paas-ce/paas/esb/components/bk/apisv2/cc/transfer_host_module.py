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


class TransferHostModule(Component):
    """
    apiLabel {{ _("业务内主机转移模块") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("业务内主机转移模块") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id     |  int     | {{ _("是") }}     | {{ _("业务ID") }} |
    | bk_host_id    |  array   | {{ _("是") }}     | {{ _("主机ID") }} |
    | bk_module_id  |  array   | {{ _("是") }}     | {{ _("模块ID") }} |
    | is_increment  |  bool    | {{ _("是") }}     | {{ _("覆盖或者追加,会删除原有关系. true是更新，false是覆盖") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_biz_id": 1,
        "bk_host_id": [
            9,
            10
        ],
        "bk_module_id": [
            10
        ],
        "is_increment": true
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "",
        "data": {}
    }
    ```
    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        bk_host_id = TypeCheckField(label='host id', promise_type=list, required=True)
        bk_module_id = TypeCheckField(label='module id', promise_type=list, required=True)
        is_increment = TypeCheckField(label='is increment', promise_type=bool, required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/hosts/modules',
            data=json.dumps(self.form_data),
        )
