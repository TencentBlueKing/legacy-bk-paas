# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import tools, configs


class GetCustomQueryData(Component):
    """
    apiLabel {{ _("根据自定义api获取数据") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("根据自定义api获取数据") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id |  int     | {{ _("是") }}     | {{ _("业务ID") }} |
    | id        |  string  | {{ _("是") }}     | {{ _("主键ID") }} |
    | start     |  int     | {{ _("是") }}     | {{ _("记录开始位置") }} |
    | limit     |  int     | {{ _("是") }}     | {{ _("每页限制条数,最大200") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_biz_id": 1,
        "id": "xxx",
        "start": 0,
        "limit": 10
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
                    "biz": {
                        "bk_biz_id": 1,
                        "bk_biz_name": "test",
                        "bk_biz_maintainer": "admin",
                        "bk_biz_productor": "admin"
                    },
                    "host": {
                        "bk_host_id": 1,
                        "bk_host_name": "nginx-1",
                        "bk_host_innerip": "10.0.0.1",
                        "bk_cloud_id": 0
                    },
                    "module": {
                        "bk_module_name": "module-test"
                    },
                    "set": {
                        "bk_set_name": "set-test"
                    }
                }
            ]
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | count     | int          | {{ _("记录条数") }} |
    | info      | array        | {{ _("主机实际数据") }} |

    #### data.info

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | biz      | dict       | {{ _("主机所属的业务信息") }} |
    | set      | dict       | {{ _("主机所属的集群信息") }} |
    | module   | dict       | {{ _("主机所属的模块信息") }} |
    | host     | dict       | {{ _("主机自身属性") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        id = forms.CharField(label='id', required=True)
        start = forms.IntegerField(label='start', required=True)
        limit = forms.IntegerField(label='limit', required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path='/api/v3/userapi/data/{bk_biz_id}/{id}/{start}/{limit}'.format(**self.form_data),
        )
