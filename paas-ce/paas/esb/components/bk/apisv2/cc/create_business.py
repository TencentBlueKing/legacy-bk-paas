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


class CreateBusiness(Component):
    """
    apiLabel {{ _("新建业务") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("新建业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | data           | dict    | {{ _("是") }}     | {{ _("业务数据") }} |

    #### data

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_biz_name       |  string  | {{ _("是") }}     | {{ _("业务名") }} |
    | bk_biz_maintainer |  string  | {{ _("是") }}     | {{ _("运维人员") }} |
    | bk_biz_productor  |  string  | {{ _("是") }}     | {{ _("产品人员") }} |
    | bk_biz_developer  |  string  | {{ _("是") }}     | {{ _("开发人员") }} |
    | bk_biz_tester     |  string  | {{ _("是") }}     | {{ _("测试人员") }} |
    | time_zone         |  string  | {{ _("是") }}     | {{ _("时区") }} |

    **注意：此处的输入参数仅对必填以及系统内置的参数做了说明，其余需要填写的参数取决于用户自己定义的属性字段。**

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "data": {
            "bk_biz_name": "cc_app_test",
            "bk_biz_maintainer": "admin",
            "bk_biz_productor": "admin",
            "bk_biz_developer": "admin",
            "bk_biz_tester": "admin",
            "time_zone": "Asia/Shanghai"
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
            "bk_biz_id": 2
        }
    }
    ```

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        data = TypeCheckField(label='data', promise_type=dict, required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/biz/{bk_supplier_account}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
