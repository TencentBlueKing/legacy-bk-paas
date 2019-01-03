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

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP
from components.component import Component
from .toolkit import tools, configs


class BindRolePrivilege(Component):
    """
    apiLabel {{ _("绑定角色权限") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("绑定角色权限") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account |  string    | {{ _("是") }}     | {{ _("开发商帐号") }} |
    | bk_obj_id           |  string    | {{ _("是") }}     | {{ _("模型ID") }} |
    | bk_property_id      |  string    | {{ _("是") }}     | {{ _("模型对应用户角色属性ID") }}   |
    | data                |  list      | {{ _("否") }}     | {{ _("角色权限数据，输入为空数组则不绑定任何权限") }}   |

    #### data

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | hostupdate | string | {{ _("否") }} | {{ _("主机编辑") }} |
    | hosttrans  | string | {{ _("否") }} | {{ _("主机转移") }} |
    | topoupdate | string | {{ _("否") }} | {{ _("主机拓扑编辑") }}  |
    | customapi  | string | {{ _("否") }} | {{ _("自定义api") }}  |
    | proconfig  | string | {{ _("否") }} | {{ _("进程管理") }}  |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_obj_id": "biz",
        "bk_property_id": "test",
        "data": [
            "hostupdate",
            "hosttrans",
            "topoupdate",
            "customapi",
            "proconfig"
        ]
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "success",
        "data": "success"
    }
    ```
    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=True)
        bk_obj_id = forms.CharField(label='bk obj id', required=True)
        bk_property_id = forms.CharField(label='bk property id', required=True)
        data = ListField(label='data', required=False)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            self.host,
            path='/api/v3/topo/privilege/{bk_supplier_account}/{bk_obj_id}/{bk_property_id}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
