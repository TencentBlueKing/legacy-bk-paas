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

import re

from common.base_utils import get_client_real_ip
from components.component import BaseComponent, SetupConfMixin
from .toolkit import configs


class DevopsComponent(BaseComponent, SetupConfMixin):
    """
    ### {{ _("功能描述") }}

    {{ _("Devops Component") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "username": "admin"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "0000",
        "message": "",
        "data": {}
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    host = configs.host

    def handle(self):
        # 替换目标地址中的变量模版
        path = self.request.wsgi_request.g.comp_path
        path = re.sub(r"^/%s" % self.sys_name.lower(), "", path)
        client_ip = get_client_real_ip(self.request.wsgi_request)

        data = self.request.get_clean_params(ctype="json")
        headers = {
            "Content-Type": "application/json",
            "appId": self.request.headers.get("Appid", ""),
            "operator": self.request.headers.get("Operator", ""),
            "Real-Client-Ip": client_ip,
        }

        self.response.payload = self.outgoing.http_client.post(
            self.host,
            path,
            data=data,
            headers=headers,
            timeout=300,
        )
