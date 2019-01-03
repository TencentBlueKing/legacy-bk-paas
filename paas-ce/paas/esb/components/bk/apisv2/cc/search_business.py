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


class SearchBusiness(Component):
    """
    apiLabel {{ _("查询业务") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("查询业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | fields         |  array   | {{ _("否") }}     | {{ _("指定查询的字段，参数为业务的任意属性，如果不填写字段信息，系统会返回业务的所有字段") }} |
    | condition      |  dict    | {{ _("否") }}     | {{ _("查询条件，参数为业务的任意属性，如果不写代表搜索全部数据") }} |
    | page           |  dict    | {{ _("否") }}     | {{ _("分页条件") }} |

    #### page

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | start    |  int    | {{ _("是") }}     | {{ _("记录开始位置") }} |
    | limit    |  int    | {{ _("是") }}     | {{ _("每页限制条数,最大200") }} |
    | sort     |  string | {{ _("否") }}     | {{ _('排序字段，通过在字段前面增加 -，如 sort:"-field" 可以表示按照字段 field降序') }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "fields": [
            "bk_biz_id",
            "bk_biz_name"
        ],
        "condition": {
            "bk_biz_name": "esb-test"
        },
        "page": {
            "start": 0,
            "limit": 10,
            "sort": ""
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
            "count": 1,
            "info": [
                {
                    "bk_biz_id": 1,
                    "bk_biz_name": "esb-test"
                }
            ]
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | count     | int       | {{ _("记录条数") }} |
    | info      | array     | {{ _("业务实际数据") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        fields = TypeCheckField(label='fields', promise_type=list, required=False)
        condition = TypeCheckField(label='condition', promise_type=dict, required=False)
        page = TypeCheckField(label='page', promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=['bk_supplier_account'])
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data['data'] = self.get_cleaned_data_when_exist(keys=['fields', 'condition', 'page'])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/biz/search/{bk_supplier_account}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
