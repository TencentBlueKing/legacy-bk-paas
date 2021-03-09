# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class SaveCron(Component):
    """
    apiLabel {{ _("新建或保存定时作业") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("新建或保存定时作业；新建定时作业，作业状态默认为暂停；操作者必须是业务的创建人或运维") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}            |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------------|------------|--------|------------|
    | app_id          |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | name            |  string    | {{ _("是") }}     | {{ _("定时作业的名称") }} |
    | task_id         |  int       | {{ _("是") }}     | {{ _("要定时执行的作业的作业ID") }} |
    | crontab_task_id |  int       | {{ _("否") }}     | {{ _("定时任务ID，更新定时任务时，必须传这个值") }} |
    | cron_expression |  string    | {{ _("是") }}     | {{ _("定时任务crontab的定时规则，各自段含义为：秒 分 时 日 月 周 年（可选），如: 0 0/5 * * * ?  表示每5分钟执行一次") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "name": "hotest",
        "task_id": 123,
        "cron_expression": "0 0/5 * * * ?"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "crontabTaskId": 2
        }
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        name = forms.CharField(label="task name", required=True)
        task_id = forms.IntegerField(label="task template ID", required=True)
        crontab_task_id = forms.IntegerField(label="cron task ID", required=False)
        cron_expression = forms.CharField(label="cron rules", required=True)

        def clean(self):
            data = self.cleaned_data
            params = {
                "appId": data["app_id"],
                "name": data["name"],
                "taskId": data["task_id"],
                "cronExpression": data["cron_expression"],
            }
            if data["crontab_task_id"]:
                params["crontabTaskId"] = data["crontab_task_id"]
            return params

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="saveCront", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
