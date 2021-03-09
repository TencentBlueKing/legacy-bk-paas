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
from common.forms import BaseComponentForm
from common.base_utils import smart_unicode_v2
from common.constants import API_TYPE_Q

from .toolkit import tools, configs


class ProcGetTaskResultById(Component):
    """
    apiLabel {{ _("进程管理：获取任务结果") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("进程管理：获取任务结果") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | task_id   |  string    | {{ _("是") }}     | {{ _("执行命令后产生的任务ID，可在proc_run_command接口中找到") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "task_id": "GSEPROC:20160301111111:1"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "success",
        "data": {
            "failed": [],
            "execInfo": [
                "*.*.*.* matching..."
            ],
            "error_code": 0,
            "error_msg": "success",
            "success": [
                {
                    "proc_id": "test.test.1.1",
                    "seq_id": "",
                    "ipaddr": "10.0.0.1",
                    "app_id": "1",
                    "content": "xxx",
                    "host_name": "yyy",
                    "env_id": "1",
                    "error_code": 0,
                    "error_msg": "success",
                    "end_time": 1302248902
                }
            ]
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | error_code| int       | {{ _("任务状态码，0表示成功，804表示执行中，其他表示失败") }} |

    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.gse_proc_host
    port = configs.gse_proc_port

    class Form(BaseComponentForm):
        task_id = forms.CharField(label="task ID", required=True)

    def handle(self):
        data = self.form_data

        client = tools.GSEProcServerClient(
            self.host,
            self.port,
            use_test_env=self.request.use_test_env,
            component=self,
        )
        client.connect()
        resp = client.request("getTaskResultById", args=[data["task_id"]])
        client.close()

        # 为了让调用者可以正确拿到错误代码，此处将 result 全部置为 True
        resp["result"] = True

        tresp = resp.pop("__tresp")

        # success中content可能存在GBK编码的中文
        success = []
        for s in tresp.success:
            s = s.__dict__
            s["content"] = smart_unicode_v2(s["content"])
            success.append(s)

        resp["data"] = {
            "error_code": tresp.error_code,
            "error_msg": tresp.error_msg,
            "success": success,
            "failed": [r.__dict__ for r in tresp.failed],
            "execInfo": tresp.execInfo,
        }
        self.response.payload = resp
