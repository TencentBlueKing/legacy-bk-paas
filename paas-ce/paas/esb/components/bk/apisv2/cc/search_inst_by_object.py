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


class SearchInstByObject(Component):
    """
    apiLabel {{ _("查询实例详情") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("查询给定模型的实例信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account |  string  | {{ _("否") }}     | {{ _("开发商帐号") }} |
    | bk_obj_id           |  string  | {{ _("是") }}     | {{ _("自定义模型ID，查询区域时为plat") }} |
    | fields              |  array   | {{ _("否") }}     | {{ _("指定查询的字段") }} |
    | condition           |  dict    | {{ _("否") }}     | {{ _("查询条件") }} |
    | page                |  dict    | {{ _("否") }}     | {{ _("分页条件") }} |

    #### page

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | start    |  int    | {{ _("是") }}     | {{ _("记录开始位置") }} |
    | limit    |  int    | {{ _("是") }}     | {{ _("每页限制条数,最大200") }} |
    | sort     |  string | {{ _("否") }}     | {{ _('排序字段') }} |

    #### fields参数说明：

    参数为查询的目标实例对应的模型定义的所有字段。


    #### condition 参数说明：

    condition 参数为查询的目标实例对应的模型定义的所有字段。

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_obj_id": "plat",
        "fields": [
        ],
        "condition": {
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
        "message": "success",
        "data": {
            "count": 4,
            "info": [
                {
                    "bk_cloud_id": 0,
                    "bk_cloud_name": "default area",
                    "bk_supplier_account": "123456789"
                }
            ]
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | count     | int       | {{ _("info 集合中元素的数量") }} |
    | info      | array     | {{ _("查询的模型的实例集合") }} |

    #### info

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | bk_cloud_id         | int       | {{ _("云区域ID") }} |
    | bk_cloud_name       | string    | {{ _("云区域名") }} |
    | bk_supplier_account | string    | {{ _("开发商账号") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        bk_obj_id = forms.CharField(label='object id', required=True)
        fields = TypeCheckField(label='fields', promise_type=list, required=False)
        condition = TypeCheckField(label='condition', promise_type=dict, required=False)
        page = TypeCheckField(label='page', promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=['bk_supplier_account', 'bk_obj_id'])
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data['data'] = self.get_cleaned_data_when_exist(keys=['fields', 'condition', 'page'])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/inst/search/owner/{bk_supplier_account}/object/{bk_obj_id}'.format(**self.form_data),
            data=json.dumps(self.form_data['data']),
        )
