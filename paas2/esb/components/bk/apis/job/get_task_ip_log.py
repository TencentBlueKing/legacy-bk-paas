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


class GetTaskIpLog(Component):
    """
    apiLabel {{ _("根据作业实例ID查询作业执行日志") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("根据作业实例ID查询作业执行日志") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | task_instance_id |  int    | {{ _("是") }}     | {{ _("作业实例ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "task_instance_id": "100932"
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
                "isFinished": true,
                "stepInstanceName": "xxx",
                "stepAnalyseResult": [
                    {
                        "count": "1",
                        "resultType": 9,
                        "ipLogContent": [
                            {
                                "status": 9,
                                "totalTime": 0.24799999594688416,
                                "stepInstanceId": 156965,
                                "isJobIp": 1,
                                "ip": "xxx.xxx.xxx.xxx",
                                "errCode": 0,
                                "source": 1,
                                "logContent": "QlpoOTFBWSZTWekFHDQAGcHf+XMyQA...",
                                "startTime": "2016-06-12 14:29:39",
                                "retryCount": 0,
                                "endTime": "2016-06-12 14:29:39",
                                "exitCode": 0
                            }
                        ],
                        "resultTypeText": "xxx"
                    }
                ],
                "stepInstanceId": 156965,
                "stepInstanceStatus": 3
            }
        ]
    }
    ```
    #### ipLogContent

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | status    | int       | {{ _("主机任务状态码，1.Agent异常; 3.上次已成功; 5.等待执行; 7.正在执行; 9.执行成功; 11.任务失败; 12.任务下发失败; 13.任务超时; 15.任务日志错误; 101.脚本执行失败; 102.脚本执行超时; 103.脚本执行被终止; 104.脚本返回码非零; 202.文件传输失败; 203.源文件不存在; 310.Agent异常; 311.用户名不存在; 320.文件获取失败; 321.文件超出限制; 329.文件传输错误; 399.任务执行出错") }} |
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
        data = tools.get_basic_json(action="getTaskIpLog", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
