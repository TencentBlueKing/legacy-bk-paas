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
    apiLabel get host list
    apiMethod GET

    ### Functional Description

    Get host list

    ### Request Parameters

    {{ common_args_desc }}

    #### Interface Parameters

    | Field  |  Type | Required   |  Description     |
    |-----------|------------|--------|------------|
    | app_id  | int   | Yes | Business ID  |
    | ip_list | array | No  | Host IP address, including ip and bk_cloud_id, bk_cloud_id represents cloud area ID |

    ### Request Parameters Example

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

    ### Return Result Example

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
                "bk_cloud_id": 2,
                "host_name": "db-2",
                "maintainer": "admin"
            }
        ]
    }
    ```
    """

    # Name of the system to which the component belongs
    sys_name = configs.SYSTEM_NAME

    # Form Processing Parameters Validation
    class Form(BaseComponentForm):
        bk_biz_id = forms.CharField(label='Business ID', required=True)
        ip_list = TypeCheckField(label='Host IP address', promise_type=list, required=False)

        # The data returned in clean method is available through the component's form_data property
        def clean(self):
            return self.get_cleaned_data_when_exist(keys=['bk_biz_id', 'ip_list'])

    # Component Processing Access
    def handle(self):
        # Get the data processed in Form clean
        data = self.form_data

        # Set Current Operator
        data['operator'] = self.current_user.username

        # Request System Interface
        try:
            response = self.outgoing.http_client.post(
                host=configs.host,
                path='/hcp/get_host_list/',
                data=json.dumps(data),
            )
        except Exception:
            # TODO: To delete, only fake data for testing
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

        # Analyze the Results
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

        # Set the component return result, and payload is the actual return result of component
        self.response.payload = result
