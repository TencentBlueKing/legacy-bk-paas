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


class GetProcConfigInstanceStatus(Component):
    """
    apiLabel {{ _("获取刷新进程实例状态") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取刷新进程实例状态") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | task_id   |  string    | {{ _("是") }}     | {{ _("任务ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "task_id": "INSTdd7b350898b6c6c3d1a9e3fe444f01f3",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "message": "",
        "code": "00",
        "data": {
            "status": 0
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | result    | boolean   | {{ _("包含True和False，其中True表示成功，False表示失败") }} |
    | code      | string    | {{ _('返回错误码，其中"00"表示成功，其它表示失败') }} |
    | data      | object    | {{ _("返回数据，成功返回请求数据，可根据其中的 status，判断任务当前状态，0为正在更新中，1为成功，其他为失败") }} |
    | messge    | string    | {{ _("返回错误消息") }} |
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.CharField(label='business ID', required=True)
        task_id = forms.CharField(label='task ID', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'requestId': data['task_id'],
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/ProcConfigManage/getProcStatus',
            data=self.form_data,
        )
