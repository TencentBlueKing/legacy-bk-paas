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


class AddApp(Component):
    """
    apiLabel {{ _("新建业务") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("新建业务") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_name  | string     | {{ _("是") }}     | {{ _("业务名") }} |
    | maintainers | string   | {{ _("是") }}     | {{ _("运维人员, 多个人之间用逗号分隔") }} |
    | product_pm | string    | {{ _("否") }}     | {{ _("产品人员，多个人之间用逗号分隔") }} |
    | developer | string     | {{ _("否") }}     | {{ _("开发人员，多个人之间用逗号分隔") }} |
    | tester    | string     | {{ _("否") }}     | {{ _("测试人员，多个人之间用逗号分隔") }} |
    | operator  | string     | {{ _("否") }}     | {{ _("操作者，多个人之间用逗号分隔") }}   |
    | company_name | string  | {{ _("是") }}     | {{ _("公司名,cmdb配置文件中定义的constants.php中的 COMPANY_NAME") }} |
    | level     | int        | {{ _("是") }}     | {{ _("业务拓扑级别，2或者3") }} |
    | life_cycle | string    | {{ _("是") }}     | {{ _("生成周期，1: 测试中, 2: 已上线, 3: 停运其中的一个值") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_name": "Test",
        "maintainers": "admin",
        "product_pm": "admin",
        "company_name": "CompanyName",
        "level": 3,
        "life_cycle": "1"
    }
    ```

    ### 返回结果示例

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "appId": 25
        }
    }

    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_name = forms.CharField(label='business name', required=True)
        maintainers = ListField(label='OPS', required=True)
        product_pm = ListField(label='PM', required=False)
        developer = ListField(label='developer', required=False)
        tester = ListField(label='test staff', required=False)
        operator = ListField(label='operator', required=False)
        company_name = forms.CharField(label='company name', required=True)
        level = forms.IntegerField(label='business topology level', required=True)
        life_cycle = forms.CharField(label='life cycle', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationName': data['app_name'],
                'Maintainers': ','.join(data['maintainers']),
                'ProductPm': ','.join(data['product_pm']),
                'Developer': ','.join(data['developer']),
                'Tester': ','.join(data['tester']),
                'Operator': ','.join(data['operator']),
                'CompanyName': data['company_name'],
                'Level': data['level'],
                'LifeCycle': data['life_cycle'],
            }

    def handle(self):
        self.form_data['Creator'] = self.current_user.username

        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/app/addApp',
            data=self.form_data,
        )
