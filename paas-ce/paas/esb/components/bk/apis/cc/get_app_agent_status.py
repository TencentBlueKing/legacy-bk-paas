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
from .toolkit import configs


class GetAppAgentStatus(Component):
    """
    apiLabel {{ _("查询业务下Agent状态") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务下Agent状态") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id |  int    | {{ _("是") }}     | {{ _("业务ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "message": "",
        "code": "00",
        "data": {
            "agentNorList": [ ],
            "agentAbnorCnt": 3,
            "agentNorCnt": 0,
            "agentAbnorList": [
                {
                    "Ip": "10.0.0.1",
                    "PlatId": "1",
                    "CompanyId": 0
                },
                {
                    "Ip": "10.0.0.2",
                    "PlatId": "1",
                    "CompanyId": 0
                },
                {
                    "Ip": "10.0.0.3",
                    "PlatId": "1",
                    "CompanyId": 0
                }
            ]
        },
    }

    ```

    ### {{ _("返回结果示例") }} -- {{ _("失败") }}

    ```python
    {
        "code": "50000",
        "error": {
            "error_data": {
                "api_spec": {
                }
            }
        },
        "result": false,
        "message": "{{ _('没权利访问业务') }}",
        "data": null
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_supplier_id = forms.IntegerField(label='bk supplier id', required=False)
        bk_supplier_account = forms.CharField(label='bk supplier account', required=False)
        app_id = forms.CharField(label='business ID', required=True)

        def clean(self):
            return self.get_cleaned_data_when_exist()

    def handle(self):
        bk_supplier_id = self.form_data.get('bk_supplier_id', 0)
        agent_nor_list = []
        agent_abnor_list = []

        result = self.invoke_other('generic.cc.get_app_host_list', kwargs=self.form_data)
        if not result['result']:
            self.response.payload = result
            return
        hosts = [
            {
                'ip': host['InnerIP'],
                'bk_cloud_id': host['Source'],
            }
            for host in result.get('data') or []
        ]
        if not hosts:
            self.response.payload = {
                'result': True,
                'data': {
                    'agentNorList': agent_nor_list,
                    'agentNorCnt': len(agent_nor_list),
                    'agentAbnorList': agent_abnor_list,
                    'agentAbnorCnt': len(agent_abnor_list),
                }
            }
            return

        params = {
            'bk_supplier_id': bk_supplier_id,
            'hosts': hosts,
        }
        result = self.invoke_other('generic.v2.gse.get_agent_status', kwargs=params)
        if not result['result']:
            self.response.payload = result
            return

        for host in result['data'].values():
            _host = {
                'Ip': host['ip'],
                'PlatId': host['bk_cloud_id'],
                'CompanyId': bk_supplier_id,
            }
            if host['bk_agent_alive'] == 1:
                agent_nor_list.append(_host)
            else:
                agent_abnor_list.append(_host)
        self.response.payload = {
            'result': True,
            'data': {
                'agentNorList': agent_nor_list,
                'agentNorCnt': len(agent_nor_list),
                'agentAbnorList': agent_abnor_list,
                'agentAbnorCnt': len(agent_abnor_list),
            }
        }
