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


class SearchHost(Component):
    """
    apiLabel {{ _("根据条件查询主机") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("根据条件查询主机") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_supplier_account | string     | {{ _("否") }}     | {{ _("开发商账号") }} |
    | bk_biz_id  |  int     | {{ _("否") }}     | {{ _("业务ID") }} |
    | ip         |  dict    | {{ _("否") }}     | {{ _("主机ip列表") }} |
    | condition  |  array   | {{ _("否") }}     | {{ _("组合条件") }} |
    | page       |  dict    | {{ _("否") }}     | {{ _("查询条件") }} |
    | pattern    |  string  | {{ _("否") }}     | {{ _("按表达式搜索") }} |

    #### ip

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | data      |  array    | {{ _("否") }}     | {{ _("ip 数组") }} |
    | exact     |  int      | {{ _("否") }}     | {{ _("是否根据ip精确搜索") }} |
    | flag      |  string   | {{ _("否") }}     | {{ _("bk_host_innerip只匹配内网ip,bk_host_outerip只匹配外网ip, bk_host_innerip,bk_host_outerip同时匹配") }} |

    #### condition

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_obj_id    |  string    | {{ _("否") }}     | {{ _("对象名,可以为biz,set,module,host,object") }} |
    | fields     |  array      | {{ _("否") }}     | {{ _("查询输出字段") }} |
    | condition     |  array      | {{ _("否") }}     | {{ _("查询条件") }} |

    #### condition.condition

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | field     |  string    | {{ _("否") }}     | {{ _("对象的字段") }} |
    | operator  |  string    | {{ _("否") }}     | {{ _("操作符, $eq为相等，$neq为不等，$in为属于，$nin为不属于") }} |
    | value     |  string    | {{ _("否") }}     | {{ _("字段对应的值") }} |

    #### page

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | start    |  int    | {{ _("是") }}     | {{ _("记录开始位置") }} |
    | limit    |  int    | {{ _("是") }}     | {{ _("每页限制条数,最大200") }} |
    | sort     |  string | {{ _("否") }}     | {{ _("排序字段") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_supplier_account": "123456789",
        "ip": {
            "data": [],
            "exact": 1,
            "flag": "bk_host_innerip|bk_host_outerip"
        },
        "condition": [
            {
                "bk_obj_id": "host",
                "fields": [],
                "condition": []
            },
            {
                "bk_obj_id":"module",
                "fields":[],
                "condition":[]
            },
            {
                "bk_obj_id":"set",
                "fields":[],
                "condition":[]
            },
            {
                "bk_obj_id":"biz",
                "fields":[],
                "condition":[]
            },
            {
                "bk_obj_id": "object",
                "fields": [],
                "condition": [
                    {
                        "field": "bk_inst_id",
                        "operator": "$eq",
                        "value": 76
                    }
                ]
            }
        ],
        "page": {
            "start": 0,
            "limit": 10,
            "sort": "bk_host_id"
        },
        "pattern": ""
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python

    {
        "result": true,
        "code": 0,
        "message": "success",
        "data": {
            "count": 1,
            "info": [
                {
                    "host": {
                        "bk_cpu": 8,
                        "bk_os_name": "linux centos",
                        "bk_host_id": 11,
                        "import_from": "",
                        "bk_os_version": "7.2",
                        "bk_disk": 1789,
                        "operator": null,
                        "create_time": "2018-03-22T16:52:53.239+08:00",
                        "bk_mem": 7843,
                        "bk_host_name": "test-1",
                        "bk_host_innerip": "10.0.0.1",
                        "bk_comment": "",
                        "bk_os_bit": "64-bit",
                        "bk_outer_mac": "",
                        "bk_childid": null,
                        "bk_input_from": "agent",
                        "bk_asset_id": "",
                        "bk_service_term": null,
                        "bk_cloud_id": [
                            {
                                "bk_obj_name": "",
                                "id": "0",
                                "bk_obj_id": "plat",
                                "bk_obj_icon": "",
                                "bk_inst_id": 0,
                                "bk_inst_name": "default area"
                            }
                        ],
                        "bk_sla": "",
                        "bk_cpu_mhz": 2534,
                        "bk_host_outerip": "",
                        "bk_os_type": "1",
                        "bk_mac": "00:00:00:00:00:00",
                        "bk_bak_operator": null,
                        "bk_sn": "",
                        "bk_cpu_module": "Intel(R)"
                    },
                    "set": [
                        {
                            "bk_biz_id": 2,
                            "bk_service_status": "1",
                            "description": "",
                            "bk_set_env": "1",
                            "default": 0,
                            "bk_parent_id": 35,
                            "bk_capacity": null,
                            "bk_set_id": 3,
                            "create_time": "2018-06-06T20:53:53.591+08:00",
                            "bk_supplier_account": "123456789",
                            "bk_set_name": "test",
                            "bk_set_desc": "",
                            "last_time": "2018-06-13T14:20:20.149+08:00"
                        }
                    ],
                    "biz": [
                        {
                            "bk_biz_id": 2,
                            "language": "1",
                            "life_cycle": "1",
                            "bk_biz_developer": "",
                            "bk_biz_maintainer": "admin",
                            "bk_biz_tester": "admin",
                            "time_zone": "Asia/Shanghai",
                            "default": 0,
                            "create_time": "2018-03-22T15:49:57.319+08:00",
                            "bk_biz_productor": "admin",
                            "bk_supplier_account": "123456789",
                            "operator": "",
                            "bk_biz_name": "test",
                            "last_time": "2018-06-05T15:03:55.699+08:00",
                            "bk_supplier_id": 0
                        }
                    ],
                    "module": [
                        {
                            "bk_biz_id": 2,
                            "bk_module_id": 38,
                            "default": 0,
                            "bk_bak_operator": "",
                            "create_time": "2018-03-26T16:56:59.486+08:00",
                            "bk_module_name": "test_1",
                            "bk_supplier_account": "123456789",
                            "operator": "admin",
                            "bk_set_id": 3,
                            "bk_parent_id": 3,
                            "last_time": "2018-03-26T16:56:59.486+08:00",
                            "bk_module_type": "1"
                        }
                    ]
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
    | info      | array     | {{ _("主机实际数据") }} |

    #### data.info

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | biz      | array       | {{ _("主机所属的业务信息") }} |
    | set      | array       | {{ _("主机所属的集群信息") }} |
    | module   | array       | {{ _("主机所属的模块信息") }} |
    | host     | dict        | {{ _("主机自身属性") }} |

    """  # noqa
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label='business id', required=False)
        ip = TypeCheckField(label='ip', promise_type=dict, required=False)
        condition = TypeCheckField(label='condition', promise_type=list, required=False)
        page = TypeCheckField(label='page', promise_type=dict, required=False)
        pattern = forms.CharField(label='pattern', required=False)

        def clean(self):
            return self.get_cleaned_data_when_exist()

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path='/api/v3/hosts/search',
            data=json.dumps(self.form_data),
        )
