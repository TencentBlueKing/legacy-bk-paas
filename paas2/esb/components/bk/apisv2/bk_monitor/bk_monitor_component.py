# -*- coding: utf-8 -*-
import json

from common.errors import error_codes
from components.component import Component, SetupConfMixin
from .toolkit import configs


class BkMonitorComponent(Component, SetupConfMixin):

    sys_name = configs.SYSTEM_NAME
    host = configs.host

    def handle(self):
        # 获取参数，并去除bk_app_code、bk_app_secret等参数
        params = self.request.get_strict_clean_params()
        if self.dest_http_method == "GET":
            params, data = params, None
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
        else:
            params, data = None, json.dumps(params)
            headers = {"Content-Type": "application/json"}

        # 请求接口
        response = self.outgoing.http_client.request(
            self.dest_http_method,
            self.host,
            self.dest_path,
            params=params,
            data=data,
            headers=headers,
            timeout=60,
        )

        try:
            response["code"] = 0 if response["result"] else 1306000
        except Exception:
            raise error_codes.THIRD_PARTY_RESULT_ERROR.format_prompt(args=configs.SYSTEM_NAME)

        self.response.payload = response
