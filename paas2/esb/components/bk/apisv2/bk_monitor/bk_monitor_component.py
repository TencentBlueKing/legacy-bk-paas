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
