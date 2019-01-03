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


class AddHostToResource(Component):
    """
    apiLabel {{ _("新增主机到资源池") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("新增主机到资源池") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account |  string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | host_info      |  dict    | {{ _("是") }}     | {{ _("主机信息") }} |
    | bk_biz_id      |  int     | {{ _("否") }}     | {{ _("业务ID") }}   |

    #### host_info

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_host_innerip |  string   | {{ _("是") }}     | {{ _("主机内网ip") }} |
    | import_from     |  string   | {{ _("是") }}     | {{ _("主机导入来源,以api方式导入为3") }} |
    | bk_cloud_id     |  int      | {{ _("是") }}     | {{ _("云区域ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "host_info": {
            "0": {
                "bk_host_innerip": "10.0.0.1",
                "bk_cloud_id": 0,
                "import_from": "3"
            }
        }
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
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        host_info = TypeCheckField(label='host info', required=True)
        bk_biz_id = forms.IntegerField(label='business ID', required=False)

        def clean(self):
            return self.get_cleaned_data_when_exist()

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            self.host,
            path='/api/v3/hosts/add',
            data=json.dumps(self.form_data),
        )
