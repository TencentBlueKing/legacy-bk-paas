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
from common.constants import API_TYPE_Q

from .toolkit import tools, configs


class GetCron(Component):
    """
    apiLabel {{ _("查询业务下定时作业信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询业务下定时作业信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}                 |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |----------------------|------------|--------|------------|
    | app_id               |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | crontab_task_id      |  int       | {{ _("否") }}     | {{ _("定时任务ID，如果存在，则忽略其他筛选条件，只查询这个指定的作业信息") }} |
    | name                 |  string    | {{ _("否") }}     | {{ _("定时作业的名称") }} |
    | status               |  string    | {{ _("否") }}     | {{ _("作业的状态：1.已启动、2.已暂停、3.已完成") }} |
    | creater              |  string    | {{ _("否") }}     | {{ _("作业创建人") }} |
    | last_modify_user     |  string    | {{ _("否") }}     | {{ _("最后修改人") }} |
    | create_time_start    |  string    | {{ _("否") }}     | {{ _("创建起始时间，YYYY-MM-DD格式") }} |
    | create_time_end      |  string    | {{ _("否") }}     | {{ _("创建结束时间，YYYY-MM-DD格式") }} |
    | last_modify_time_start |  string  | {{ _("否") }}     | {{ _("最后修改起始时间，YYYY-MM-DD格式") }} |
    | last_modify_time_end |  string    | {{ _("否") }}     | {{ _("最后修改结束时间，YYYY-MM-DD格式") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "crontab_task_id": 123456,
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "status": 1,
                "lastModifyUser": "admin",
                "des": "",
                "createTime": "2017-03-01 19:45:51",
                "creater": "admin",
                "lastModifyTime": "2017-03-01 20:01:08",
                "cronExpression": "2 0/5 * * * ?",
                "taskId": 5,
                "appId": 3,
                "taskName": "de",
                "type": 0,
                "id": 2,
                "name": "hello test2 a"
            }
        ]
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        crontab_task_id = forms.IntegerField(label="cron task ID", required=False)
        name = forms.CharField(label="cron job name", required=False)
        status = forms.CharField(label="job status", required=False)
        creater = forms.CharField(label="creater", required=False)
        last_modify_user = forms.CharField(label="last modifier", required=False)
        create_time_start = forms.DateField(label="creation start time", required=False, input_formats=["%Y-%m-%d"])
        create_time_end = forms.DateField(label="creation end time", required=False, input_formats=["%Y-%m-%d"])
        last_modify_time_start = forms.DateField(
            label="last modification start time", required=False, input_formats=["%Y-%m-%d"]
        )
        last_modify_time_end = forms.DateField(
            label="last modification end time", required=False, input_formats=["%Y-%m-%d"]
        )

        def clean(self):
            data = self.cleaned_data
            params = {
                "appId": data["app_id"],
                "crontabTaskId": data["crontab_task_id"],
                "name": data["name"],
                "status": data["status"],
                "creater": data["creater"],
                "lastModifyUser": data["last_modify_user"],
                "createTimeStart": data["create_time_start"].strftime("%Y-%m-%d") if data["create_time_start"] else "",
                "createTimeEnd": data["create_time_end"].strftime("%Y-%m-%d") if data["create_time_end"] else "",
                "lastModifyTimeStart": (
                    data["last_modify_time_start"].strftime("%Y-%m-%d") if data["last_modify_time_start"] else ""
                ),
                "lastModifyTimeEnd": (
                    data["last_modify_time_end"].strftime("%Y-%m-%d") if data["last_modify_time_end"] else ""
                ),
            }
            return params

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="queryCront", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
