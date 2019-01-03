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


class GetCustomQueryDetail(Component):
    """
    apiLabel {{ _("获取自定义API详情") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取自定义api详情") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id |  int     | {{ _("是") }}     | {{ _("业务ID") }} |
    | id        |  string  | {{ _("是") }}     | {{ _("主键ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_biz_id": 1,
        "id": "xxx"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "",
        "data": {
            "bk_biz_id": 1,
            "name": "api1",
            "id": "bacfet4kd42325venmcg",
            "info": "{\\"condition\\":[{\\"bk_obj_id\\":\\"biz\\",\\"condition\\":[{\\"field\\":\\"default\\",\\"operator\\":\\"$ne\\",\\"value\\":1}],\\"fields\\":[]},{\\"bk_obj_id\\":\\"set\\",\\"condition\\":[],\\"fields\\":[]},{\\"bk_obj_id\\":\\"module\\",\\"condition\\":[],\\"fields\\":[]},{\\"bk_obj_id\\":\\"host\\",\\"condition\\":[{\\"field\\":\\"bk_host_innerip\\",\\"operator\\":\\"$eq\\",\\"value\\":\\"127.0.0.1\\"}],\\"fields\\":[\\"bk_host_innerip\\",\\"bk_host_outerip\\",\\"bk_agent_status\\"]}]}",
            "create_user": "admin",
            "create_time": "2018-03-27T16:22:43.271+08:00",
            "modify_user": "admin",
            "last_time": "2018-03-27T16:29:26.428+08:00"
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | bk_biz_id    | int          | {{ _("业务ID") }} |
    | create_time  | string       | {{ _("创建时间") }} |
    | create_user  | string       | {{ _("创建者") }} |
    | id           | string       | {{ _("自定义api主键ID") }} |
    | info         | string       | {{ _("自定义api信息") }} |
    | last_time    | string       | {{ _("更新时间") }} |
    | modify_user  | string       | {{ _("修改者") }} |
    | name         | string       | {{ _("自定义api命名") }} |

    #### data.info

    | {{ _("字段") }}      |  {{ _("类型") }}     |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_obj_id |  string   | {{ _("对象名,可以为biz,set,module,host,object") }} |
    | fields    |  array    | {{ _("查询输出字段") }} |
    | condition |  array    | {{ _("查询条件") }} |

    #### data.info.condition

    | {{ _("字段") }}      |  {{ _("类型") }}     |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | field     |  string    | {{ _("对象的字段") }} |
    | operator  |  string    | {{ _("操作符, $eq为相等，$neq为不等，$in为属于，$nin为不属于") }} |
    | value     |  string    | {{ _("字段对应的值") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        id = forms.CharField(label='id', required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path='/api/v3/userapi/detail/{bk_biz_id}/{id}'.format(**self.form_data),
        )
