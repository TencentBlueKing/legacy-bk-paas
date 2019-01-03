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

from components.component import Component
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class CreateApp(Component):
    """
    apiLabel {{ _("创建轻应用") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("创建轻应用") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_light_app_name |  string  | {{ _("是") }}     | {{ _("轻应用名称") }} |
    | app_url           |  string  | {{ _("是") }}     | {{ _("应用链接") }} |
    | developer         |  string  | {{ _("是") }}     | {{ _("应用开发者用户名，多个以分号';'分隔") }} |
    | app_tag           |  string  | {{ _("否") }}     | {{ _('应用分类，可选分类： "OpsTools"（运维工具），"MonitorAlarm"（监控告警），"ConfManage"（配置管理），"DevTools"（开发工具），"EnterpriseIT"（企业IT），"OfficeApp"（办公应用），"Other"（其它）。如果传入空参数或不是上诉分类，则使用 "Other"') }} |
    | introduction      |  string  | {{ _("否") }}     | {{ _("应用的简介") }} |
    | width             |  int     | {{ _("否") }}     | {{ _("应用在桌面打开窗口宽度") }} |
    | height            |  int     | {{ _("否") }}     | {{ _("应用在桌面打开窗口高度") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "gcloud",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_light_app_name": "轻应用测试",
        "app_url": "http://test.bking.com/o/gcloud/xxx/",
        "developer": "test1;test2",
        "introduction": "introduction",
        "width": 1024,
        "height": 768
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": 0,
        "message": "",
        "data": {
            "bk_light_app_code": "gcloud_fdfh2kl0k"
        }
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_light_app_name = forms.CharField(label='bk light app name', required=True)
        app_url = forms.CharField(label='app url', required=True)
        developer = ListField(label='developer', required=True)
        app_tag = forms.CharField(label='app tag', required=False)
        introduction = forms.CharField(label='introduction', required=False)
        width = forms.IntegerField(label='width', required=False)
        height = forms.IntegerField(label='height', required=False)

        def clean(self):
            param_keys = [
                'bk_light_app_name', 'app_url', 'developer',
                'app_tag', 'introduction', 'width', 'height'
            ]
            params = self.get_cleaned_data_when_exist(param_keys)
            params['developer'] = ';'.join(params['developer'])
            return params

    def handle(self):
        self.form_data['creator'] = self.current_user.username
        self.form_data['bk_app_code'] = self.request.app_code

        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=self.host,
            path='/paas/api/v2/create_app/',
            data=json.dumps(self.form_data)
        )
