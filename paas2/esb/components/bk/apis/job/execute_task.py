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

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class ExecuteTask(Component):
    """
    apiLabel {{ _("根据作业模板ID启动作业") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("根据作业模板ID启动作业") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | task_id   |  int       | {{ _("是") }}     | {{ _("作业ID") }} |
    | steps     |  array     | {{ _("是") }}     | {{ _("步骤参数，每项的具体参数见下面描述") }} |

    #### steps

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | scriptTimeout |  int     | {{ _("否") }}     | {{ _("脚本超时时间") }} |
    | scriptParam   |  string  | {{ _("否") }}     | {{ _("脚本参数") }} |
    | scriptId      |  int     | {{ _("否") }}     | {{ _("脚本ID") }} |
    | stepId        |  int     | {{ _("是") }}     | {{ _("步骤ID，可以只指定某几步执行") }} |
    | ipList        |  string  | {{ _("是") }}     | {{ _("IP列表格式：子网ID:IP，多个之间逗号，分割，例如：1:10.0.0.1,1:10.0.0.2") }} |
    | account       |  string  | {{ _("否") }}     | {{ _("执行账户账户名") }} |
    | fileTargetPath |  string | {{ _("否") }}     | {{ _("目标路径") }} |
    | fileSource    |  array   | {{ _("否") }}     | {{ _("源文件信息，整个参数替换，不支持内部某个变量替换。格式参考下面说明") }} |

    #### fileSource

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | file      |  string    | {{ _("是") }}     | {{ _("源文件路径，如：/tmp/t.txt") }} |
    | ipList    |  string    | {{ _("是") }}     | {{ _("源文件服务器地址，格式为：子网ID:IP，多个之间逗号分割") }} |
    | account   |  string    | {{ _("是") }}     | {{ _("源文件机器执行账户账户名") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": "1",
        "task_id": "1",
        "steps": [{
            "scriptTimeout": 1000,
            "scriptParam": "-a",
            "ipList": "1:10.0.0.1,1:10.0.0.2",
            "scriptId": 1,
            "stepId": 1,
            "account": "root",
        },
        {
            "fileTargetPath": "/tmp/[FILESRCIP]/",
            "fileSource": [{
                "file": "/tmp/t.txt",
                "ipList": "1:10.0.0.3,1:10.0.0.4",
                "account": "root",
            }],
            "ipList": "1:10.0.0.1,1:10.0.0.2",
            "stepId": 2,
            "account": "root",
        }]
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "taskInstanceName": "Test",
            "taskInstanceId": 1
        }
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.CharField(label="business ID", required=True)
        task_id = forms.CharField(label="task ID", required=True)
        steps = TypeCheckField(label="step parameters", promise_type=list, required=False)

        def clean(self):
            data = self.cleaned_data
            result = {
                "taskId": data["task_id"],
            }
            if data.get("steps"):
                result.update(steps=data["steps"])
            return result

    def handle(self):
        data = self.form_data
        data["starter"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        params = tools.get_basic_json("executeTask", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
