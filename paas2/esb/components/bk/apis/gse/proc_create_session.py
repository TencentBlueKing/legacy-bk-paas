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

from builtins import str
from django import forms

from common.forms import BaseComponentForm
from components.component import Component, SetupConfMixin
from common.constants import API_TYPE_OP
from lib.gse.procServer import ttypes

from .toolkit import tools, configs


class ProcCreateSession(Component, SetupConfMixin):
    """
    apiLabel {{ _("进程管理：新建 session") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("进程管理：新建 session") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     |  {{ _("配置平台业务ID，在[配置平台]-[开发商视图]的业务管理页面可查询") }} |
    | env_id    |  int       | {{ _("是") }}     |  {{ _("环境类型，配置平台集群的标准属性；可选值为 1（中文含义：测试环境），2（体验环境），3（正式环境）") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "env_id": 1
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "create session success",
        "data": {
            "error_code": 0,
            "error_msg": "create session success",
            "session_id": "8888888888888888888888-8888-8888-8888-888888888888"
        }
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.gse_proc_host
    port = configs.gse_proc_port

    class Form(BaseComponentForm):
        # username = forms.CharField(label='username', required=True)
        password = forms.CharField(label="password", required=False)
        app_id = forms.CharField(label="business ID", required=True)
        env_id = forms.CharField(label="environment type", required=True)

    def handle(self):
        data = self.form_data
        user = ttypes.CCUser(
            name=self.current_user.username,
            passwd=data["password"],
        )
        client = tools.GSEProcServerClient(
            self.host,
            self.port,
            use_test_env=self.request.use_test_env,
            component=self,
        )
        client.connect()
        resp = client.request("createSession", args=[user, str(data["app_id"]), str(data["env_id"])])
        client.close()

        # 为了让调用者可以正确拿到错误代码，此处将 result 全部置为 True
        resp["result"] = True

        tresp = resp.pop("__tresp")
        # 无论如何都返回 GSE 的原始结果
        resp["data"] = {"error_code": tresp.error_code, "error_msg": tresp.error_msg, "session_id": tresp.session_id}
        self.response.payload = resp

    def check_operate_perm(self):
        from apps.operate_perm.cc_perm import CCPerm

        cc_perm = CCPerm(self.request, self.current_user)
        cc_perm.assert_app_perm(self.form_data["app_id"])
