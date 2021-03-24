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

import json
from django import forms

from components.component import Component
from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from common.log import logger

# Import module from toolkit, do not use "from .toolkit.module import function" statement
# cause that will break hot-deploy feature.
from .toolkit import tools, configs


class GetProcResult(Component):
    """
    apiLabel {{ _("查询进程操作结果") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询进程操作结果") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}        |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-------------|------------|--------|------------|
    | app_id      |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | gse_task_id |  string    | {{ _("是") }}     | {{ _("GSE任务ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "gse_task_id": "GSETASK:20170405150541:20107"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "m_rsp": {
                "/usr/local/gse/gseagent/plugins/unifyTlogc/sbin/bk_gse_unifyTlogc:1:10.0.0.1": {
                    "content": "{\"ip\":\"10.0.0.1\",\"process\":[{\"instance\":[{\"cmdline\":\"\",\"cpuUsage\":0,\"cpuUsageAve\":0,\"diskSize\":-1,\"elapsedTime\":0,\"freeVMem\":\"0\",\"phyMemUsage\":0,\"pid\":-1,\"processName\":\"bk_gse_unifyTlogc\",\"startTime\":\"\",\"stat\":\"\",\"stime\":\"0\",\"threadCount\":0,\"usePhyMem\":0,\"utime\":\"0\"}],\"procname\":\"bk_gse_unifyTlogc\"}],\"timezone\":8,\"utctime\":\"2017-04-13 21:51:55\",\"utctime2\":\"2017-04-13 13:51:55\"}\n",
                    "errcode": 0,
                    "errmsg": "success"
                }
            },
            "m_errcode": 0,
            "m_errmsg": "",
            "setM_errmsg": true,
            "m_rspSize": 1,
            "setM_errcode": true,
            "setM_rsp": true
        },
    }
    ```

    ### {{ _("返回结果参数说明") }}

    | 字段      | 类型      | 描述      |
    |-----------|-----------|-----------|
    | m_errcode | int       | {{ _("任务状态码，0表示任务已经结束，115表示任务正在执行") }} |
    | m_rsp     | dict      | {{ _("各IP实际执行结果") }} |
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        gse_task_id = forms.CharField(label="gse task ID", required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "applicationId": data["app_id"],
                "gseTaskId": data["gse_task_id"],
            }

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="getProcRst", params=data)
        result = client.post(self.host, data=data)

        if result.get("data", {}).get("m_rsp"):
            new_m_rsp = {}
            for k_ip, info in list(result["data"]["m_rsp"].items()):
                try:
                    new_m_rsp[k_ip] = json.loads(info)
                except Exception:
                    logger.exception("job gse prase m_rsp exception.")
                    new_m_rsp[k_ip] = info
            result["data"]["m_rsp"] = new_m_rsp

        self.response.payload = result
