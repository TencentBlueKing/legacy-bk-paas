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
from components.component import Component
from .toolkit import configs


class GetHostList(Component):
    """
    apiLabel 查询主机列表
    apiMethod GET

    ### 功能描述

    查询主机列表

    ### 请求参数

    {{ common_args_desc }}

    #### 接口参数

    | 字段  |  类型 | 必选   |  描述     |
    |-----------|------------|--------|------------|
    | app_id  |  int    | 是  | 业务ID  |
    | ip_list |  array  | 否  | 主机IP地址，包含 ip 和 bk_cloud_id；其中，bk_cloud_id表示云区域ID  |

    ### 请求参数示例

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx-xxx-xxx-xxx-xxx",
        "bk_biz_id": 1,
        "ip_list": [
            {
                "ip": "10.0.0.1",
                "bk_cloud_id": 0
            },
            {
                "ip": "10.0.0.2"
                "bk_cloud_id": 0
            }
        ]
    }
    ```

    ### 返回结果示例

    ```python
    {
        "result": true,
        "code": 0,
        "message": "",
        "data": [
            {
                "inner_ip": "10.0.0.1",
                "bk_cloud_id": 0,
                "host_name": "db-1",
                "maintainer": "admin"
            },
            {
                "inner_ip": "10.0.0.2",
                "bk_cloud_id": 0,
                "host_name": "db-2",
                "maintainer": "admin"
            }
        ]
    }
    ```
    """

    # 组件所属系统的系统名
    sys_name = configs.SYSTEM_NAME

    # Form处理参数校验
    class Form(BaseComponentForm):
        bk_biz_id = forms.CharField(label=u'业务ID', required=True)
        ip_list = TypeCheckField(label=u'主机IP地址', promise_type=list, required=False)

        # clean方法返回的数据可通过组件的form_data属性获取
        def clean(self):
            return self.get_cleaned_data_when_exist(keys=['bk_biz_id', 'ip_list'])

    # 组件处理入口
    def handle(self):
        # 获取Form clean处理后的数据
        data = self.form_data

        # 设置当前操作者
        data['operator'] = self.current_user.username

        # 请求系统接口
        try:
            response = self.outgoing.http_client.post(
                host=configs.host,
                path='/hcp/get_host_list/',
                data=json.dumps(data),
            )
        except Exception:
            # TODO: 需要删除，仅用于测试的假数据
            response = {
                'code': 0,
                'data': [
                    {
                        'inner_ip': '10.0.0.1',
                        'bk_cloud_id': 0,
                        'host_name': 'just_for_test',
                        'maintainer': 'admin',
                    },
                ]
            }

        # 对结果进行解析
        code = response['code']
        if code == 0:
            result = {
                'result': True,
                'data': response['data'],
            }
        else:
            result = {
                'result': False,
                'message': response['message']
            }

        # 设置组件返回结果，payload为组件实际返回结果
        self.response.payload = result
