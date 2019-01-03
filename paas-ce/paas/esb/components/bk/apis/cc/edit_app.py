# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class EditApp(Component):
    """
    apiLabel {{ _("编辑业务") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("编辑业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    | int        | {{ _("是") }}     | {{ _("业务ID") }} |
    | app_name  | string     | {{ _("否") }}     | {{ _("业务名") }} |
    | maintainers | string   | {{ _("否") }}     | {{ _("运维人员, 多个人之间用逗号分隔") }} |
    | product_pm | string    | {{ _("否") }}     | {{ _("产品人员，多个人之间用逗号分隔") }} |
    | developer | string     | {{ _("否") }}     | {{ _("开发人员，多个人之间用逗号分隔") }} |
    | tester    | string     | {{ _("否") }}     | {{ _("测试人员，多个人之间用逗号分隔") }} |
    | operator  | string     | {{ _("否") }}     | {{ _("操作者，多个人之间用逗号分隔") }}   |
    | life_cycle | string    | {{ _("否") }}     | {{ _("生成周期，1: 测试中, 2: 已上线, 3: 停运其中的一个值") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "app_name": "Test",
        "operator": "test1,test2"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {},
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label='business ID', required=True)
        app_name = forms.CharField(label='business name', required=False)
        maintainers = ListField(label='OPS', required=False)
        product_pm = ListField(label='PM', required=False)
        developer = ListField(label='developer', required=False)
        tester = ListField(label='test staff', required=False)
        operator = ListField(label='operator', required=False)
        life_cycle = forms.CharField(label='life cycle', required=False)

        def clean(self):
            cleaned_data = self.cleaned_data
            data = self.data
            to_cc_key_map = {
                'app_id': 'ApplicationID',
                'app_name': 'ApplicationName',
                'maintainers': 'Maintainers',
                'product_pm': 'ProductPm',
                'developer': 'Developer',
                'tester': 'Tester',
                'operator': 'Operator',
                'life_cycle': 'LifeCycle',
            }
            params = {}
            for bk_key, cc_key in to_cc_key_map.iteritems():
                if data.get(bk_key) is not None:
                    if bk_key in ['maintainers', 'product_pm', 'developer', 'tester', 'operator']:
                        params[cc_key] = ','.join(cleaned_data[bk_key])
                    else:
                        params[cc_key] = cleaned_data[bk_key]
            return params

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/app/editApp',
            data=self.form_data,
        )
