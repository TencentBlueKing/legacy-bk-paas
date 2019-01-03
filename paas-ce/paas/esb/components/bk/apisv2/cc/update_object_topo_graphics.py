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


class UpdateObjectTopoGraphics(Component):
    """
    apiLabel {{ _("更新拓扑图") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("更新拓扑图") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | scope_type          |  string    | {{ _("是") }}     | {{ _("图形范围类型,可选global,biz,cls(当前只有global)") }} |
    | scope_id            |  string    | {{ _("是") }}     | {{ _("图形范围类型下的ID,如果为global,则填0") }}   |
    | action              |  string    | {{ _("是") }}     | {{ _("更新方法,可选update,override") }}   |
    | data                |  list      | {{ _("否") }}     | {{ _("更新数据") }}   |

    #### data

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | node_type   | string | {{ _("是") }} | {{ _("节点类型,可选obj,inst") }} |
    | bk_obj_id   | string | {{ _("是") }} | {{ _("对象模型的ID") }} |
    | bk_inst_id  | int    | {{ _("是") }} | {{ _("实例ID") }} |
    | position    | dict   | {{ _("否") }} | {{ _("节点在图中的位置") }} |
    | ext         | dict   | {{ _("否") }} | {{ _("前端扩展字段") }} |
    | bk_obj_icon | string | {{ _("否") }} | {{ _("对象模型的图标") }} |


    **注意**：

    - {{ _("scope_type,scope_id 唯一确定一张图") }}

    - {{ _("node_type,bk_obj_id,bk_inst_id 三者唯一确定每张图的一个节点，故必填") }}

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "scope_type": "global",
        "scope_id": 0,
        "action": "update",
        "data": [
            {
                "node_type": "obj",
                "bk_obj_id": "switch",
                "bk_inst_id": 0,
                "position": {
                    "x": 100,
                    "y": 100
                },
                "ext": {},
                "bk_obj_icon": "icon-cc-switch2"
            }
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
        scope_type = forms.CharField(label='scope type', required=True)
        scope_id = forms.CharField(label='scope id', required=True)
        action = forms.CharField(label='action', required=True)
        data = TypeCheckField(label='data', promise_type=list, required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/objects/topographics/scope_type/{scope_type}/scope_id/{scope_id}/action/{action}'.format(**self.form_data),  # noqa
            data=json.dumps(self.form_data['data']),
        )
