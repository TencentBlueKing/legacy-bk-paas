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


class GetTaskResult(Component):
    """
    apiLabel {{ _("根据作业实例 ID 查询作业执行状态") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("根据作业实例 ID 查询作业执行状态") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}             |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |------------------|------------|--------|------------|
    | task_instance_id |  int       | {{ _("是") }}     | {{ _("作业实例ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "task_instance_id": "65"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "isFinished": true,
            "taskInstance": {
                "status": 3,
                "totalTime": 0,
                "endTime": "2015-09-09 15:05:32",
                "startTime": "2015-09-09 15:05:32",
                "operationList": [],
                "startWay": 1,
                "taskId": -1,
                "appId": 1,
                "operator": "2797261603",
                "taskInstanceId": 65,
                "currentStepId": 75,
                "createTime": "2015-09-09 15:05:31",
                "name": "xxx-20158915516182"
            },
            "blocks": [
                {
                    "type": 1,
                    "stepInstances": [
                        {
                            "totalTime": 0,
                            "failIPNum": 0,
                            "text": null,
                            "successIPNum": 2,
                            "isPause": 0,
                            "operator": "2797261603",
                            "stepInstanceId": 75,
                            "taskInstanceId": 65,
                            "type": 1,
                            "badIPNum": 0,
                            "status": 3,
                            "stepId": -1,
                            "blockName": "xxx-20158915516182",
                            "operationList": [],
                            "startTime": "2015-09-09 15:05:32",
                            "appId": 1,
                            "totalIPNum": 2,
                            "ord": 1,
                            "createTime": "2015-09-09 15:05:31",
                            "name": "xxx-20158915516182",
                            "blockOrd": 1,
                            "retryCount": 0,
                            "endTime": "2015-09-09 15:05:32",
                            "runIPNum": 2
                        }
                    ],
                    "blockOrd": 1,
                    "blockName": "xxx-20158915516182"
                }
            ]
        },
    }
    ```

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | status    | int       | {{ _("任务状态码，1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功; 12.步骤强制终止失败") }} |
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        task_instance_id = forms.IntegerField(label="task instance ID", required=True)

        def clean(self):
            return {
                "taskInstanceId": self.cleaned_data["task_instance_id"],
            }

    def handle(self):
        data = self.form_data
        data["starter"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="getTaskResult", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
