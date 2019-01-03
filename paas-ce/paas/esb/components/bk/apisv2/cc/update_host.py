# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from common.forms import BaseComponentForm, ListField, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component
from .toolkit import tools, configs


class UpdateHost(Component):
    """
    apiLabel {{ _("更新主机属性") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("更新主机属性") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_host_id  | string      | {{ _("是") }}     | {{ _("主机ID，多个以逗号分隔") }} |
    | data        | dict        | {{ _("否") }}     | {{ _("主机数据") }} |

    #### data

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_host_name    |  string  | {{ _("否") }}     | {{ _("主机名") }} |

    **注意：输入的字段为主机定义的属性**

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_host_id": "1,2,3",
        "data": {
            "bk_host_name": "test"
        }
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "",
        "data": none
    }
    ```

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_host_id = ListField(label='host ids', required=True)
        data = TypeCheckField(label='data', promise_type=dict, required=False)

        def clean(self):
            data = self.cleaned_data
            data['data'].update(bk_host_id=','.join(data['bk_host_id']))
            return data['data']

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path='/api/v3/hosts/batch',
            data=json.dumps(self.form_data),
        )
