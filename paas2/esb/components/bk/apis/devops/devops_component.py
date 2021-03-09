# -*- coding: utf-8 -*-
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
