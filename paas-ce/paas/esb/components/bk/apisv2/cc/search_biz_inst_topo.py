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


class SearchBizInstTopo(Component):
    """
    apiLabel {{ _("查询业务实例拓扑") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务实例拓扑") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account |  string  | {{ _("否") }}     | {{ _("开发商帐号") }} |
    | bk_biz_id           |  int     | {{ _("是") }}     | {{ _("业务id") }} |
    | level               |  int     | {{ _("否") }}     | {{ _("拓扑的层级索引，索引取值从0开始，默认值为2，当设置为 -1 的时候会读取完整的业务实例拓扑") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "bk_biz_id": 1,
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": 0,
        "message": "success",
        "data": [
            {
                "bk_inst_id": 2,
                "bk_inst_name": "蓝鲸",
                "bk_obj_id": "biz",
                "bk_obj_name": "业务",
                "child": [
                    {
                        "bk_inst_id": 3,
                        "bk_inst_name": "作业平台",
                        "bk_obj_id": "set",
                        "bk_obj_name": "集群",
                        "child": [
                            {
                                "bk_inst_id": 5,
                                "bk_inst_name": "job",
                                "bk_obj_id": "module",
                                "bk_obj_name": "模块",
                                "child": []
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | bk_inst_id    | int       | {{ _("实例ID") }} |
    | bk_inst_name  | string    | {{ _("实例用于展示的名字") }} |
    | bk_obj_icon   | string    | {{ _("模型图标的名字") }} |
    | bk_obj_id     | string    | {{ _("模型ID") }} |
    | bk_obj_name   | string    | {{ _("模型用于展示的名字") }} |
    | child         | array     | {{ _("当前节点下的所有实例的集合") }} |

    #### child

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | bk_inst_id    | int       | {{ _("实例ID") }} |
    | bk_inst_name  | string    | {{ _("实例用于展示的名字") }} |
    | bk_obj_icon   | string    | {{ _("模型图标的名字") }} |
    | bk_obj_id     | string    | {{ _("模型ID") }} |
    | bk_obj_name   | string    | {{ _("模型用于展示的名字") }} |
    | child         | array     | {{ _("当前节点下的所有实例的集合") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        bk_biz_id = forms.IntegerField(label='business id', required=True)
        level = forms.IntegerField(label='level', required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=['bk_supplier_account', 'bk_biz_id'])
            data.setdefault('bk_supplier_account', configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data['data'] = self.get_cleaned_data_when_exist(keys=['level'])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path='/api/v3/topo/inst/{bk_supplier_account}/{bk_biz_id}'.format(**self.form_data),
            params=self.form_data['data'],
        )
