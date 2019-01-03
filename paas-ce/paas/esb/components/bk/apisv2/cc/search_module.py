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
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import tools, configs


class SearchModule(Component):
    """
    apiLabel {{ _("查询模块") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("查询模块") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id      |  int     | {{ _("是") }}     | {{ _("业务id") }} |
    | bk_set_id      |  int     | {{ _("是") }}     | {{ _("集群ID") }} |
    | fields         |  array   | {{ _("是") }}     | {{ _("查询字段，字段来自于模块定义的属性字段") }} |
    | condition      |  dict    | {{ _("是") }}     | {{ _("查询条件，字段来自于模块定义的属性字段") }} |
    | page           |  dict    | {{ _("是") }}     | {{ _("分页条件") }} |

    #### page

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | start    |  int    | {{ _("是") }}     | {{ _("记录开始位置") }} |
    | limit    |  int    | {{ _("是") }}     | {{ _("每页限制条数") }} |
    | sort     |  string | {{ _("否") }}     | {{ _('排序字段') }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "fields": [
            "bk_module_name"
        ],
        "condition": {
            "bk_module_name": "test"
        },
        "page": {
            "start": 0,
            "limit": 10
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
            "count": 2,
            "info": [
                {
                    "bk_module_name": "cc_service"
                },
                {
                    "bk_module_name": "cmdb"
                }
            ]
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | count     | int       | {{ _("数据数量") }} |
    | info      | array     | {{ _("结果集，其中，所有字段均为模块定义的属性字段") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        bk_set_id = forms.IntegerField(label='set id', required=True)
        fields = TypeCheckField(label='fields', promise_type=list, required=False)
        condition = TypeCheckField(label='condition', promise_type=dict, required=False)
        page = TypeCheckField(label='page', promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=['bk_supplier_account', 'bk_biz_id', 'bk_set_id'])
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data['data'] = self.get_cleaned_data_when_exist(keys=['fields', 'condition', 'page'])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/module/search/{bk_supplier_account}/{bk_biz_id}/{bk_set_id}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
