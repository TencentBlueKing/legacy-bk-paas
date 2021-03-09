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

import time

from django import forms

from components.component import Component
from common.errors import CommonAPIError
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP

from lib.gse.procServer import ttypes

from .toolkit import tools, configs


class ProcRunCommand(Component):
    """
    apiLabel {{ _("进程管理：执行命令") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("进程管理：执行命令") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | session_id | string    | {{ _("是") }}     | {{ _("新建Session后产生的会话ID，可在proc_create_session接口中找到") }} |
    | cmd       |  string    | {{ _("是") }}     | {{ _("命令动作，可选值：createcfg（含义：从配置模板生成配置），pushcfg（将createcfg生成的配置下发至服务器），start（启动进程），stop（停止进程），restart（重启进程），reload（重新加载进程），kill（Kill进程），noauto（将进程注册为非托管状态，进程crash后不自动拉起），autoproc（将进程注册为托管状态，进程crash后可自动拉起），check（检查进程实例），getremotecfg（获取业务机器的配置文件）") }} |
    | proc_id   |  string    | {{ _("是") }}     | {{ _('进程实例ID，可在[配置平台]-[进程管理]-[进程模块绑定]页面找到，例如 "公共组件.nginx.1.1"') }} |
    | ipaddr    |  string    | {{ _("否") }}     | {{ _('过滤主机IP。比如进程实例ID为*.*.*.*，ipaddr为"10.0.0.1"，则执行10.0.0.1上的所有进程实例') }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "session_id": "8888888888888888888888-8888-8888-8888-888888888888",
        "cmd": "check",
        "proc_id": "*.*.*.*",
        "ipaddr": "10.0.0.1"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "unique_id": "88888888-8888-8888-8888-888888888888",
            "session_id": "8888888888888888888888-8888-8888-8888-888888888888",
            "error_code": 0,
            "error_msg": "",
            "task_id": "GSEPROC:20160101111111:1"
        }
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.gse_proc_host
    port = configs.gse_proc_port

    class Form(BaseComponentForm):
        session_id = forms.CharField(label="session ID", required=True)
        # username = forms.CharField(label='operator', required=True)
        cmd = forms.CharField(label="command action", required=True)
        proc_id = forms.CharField(label="process instance ID", required=True)
        params = ListField(label="command parameters", required=False)
        ipaddr = forms.CharField(label="filtered host ip", required=False)

        def clean(self):
            data = self.cleaned_data
            if data["cmd"] in ["runcmd", "runshell"]:
                raise forms.ValidationError("Does not support the command action: %s" % data["cmd"])
            return data

    def handle(self):
        data = self.form_data

        cmd = ttypes.Proc_Command(
            session_id=data["session_id"],
            operators=self.current_user.username,
            proc_id=data["proc_id"],
            cmd=data["cmd"],
            params=data["params"],
            ipaddr=data["ipaddr"],
            ctime=time.time(),
        )

        client = tools.GSEProcServerClient(
            self.host,
            self.port,
            use_test_env=self.request.use_test_env,
            component=self,
        )
        client.connect()
        if not client.supports_command(data["cmd"]):
            raise CommonAPIError("Does not support the command action: %s" % data["cmd"])

        resp = self.run_command(client, cmd)
        client.close()
        self.response.payload = resp

    def run_command(self, client, cmd):
        resp = client.request(cmd.cmd, args=[cmd])

        # 为了让调用者可以正确拿到错误代码，此处将 result 全部置为 True
        resp["result"] = True

        tresp = resp.pop("__tresp")
        resp["data"] = {
            "error_code": tresp.error_code,
            "error_msg": tresp.error_msg,
            "task_id": tresp.proctask_id,
            "session_id": tresp.session_id,
            "unique_id": tresp.unique_id,
        }
        return resp
