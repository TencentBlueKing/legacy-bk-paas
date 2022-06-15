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
from components.component import ConfComponent

from .toolkit import configs


class GseComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME

    def get_host(self):
        dest_host_group = getattr(self, "dest_host_group", "")
        if dest_host_group == "pms":
            return configs.gse_pms_host
        else:
            raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt(
                "The component's dest_host_group is not provided, "
                "please contact the component developer to handle it.",
                replace=True,
            )

    def handle(self):
        request_info = self.get_request_info()

        if self.dest_http_method == "GET":
            params, data = None, json.dumps(request_info["params"])
        else:
            params, data = None, request_info["data"]

        response = self.outgoing.http_client.request(
            self.dest_http_method,
            host=self.get_host(),
            path=request_info["path"],
            params=params,
            data=data,
            headers={
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
            },
        )

        try:
            if self._is_legacy(response):
                response = self._format_legacy_response(response)
            else:
                response = self._format_response(response)
        except Exception:
            raise error_codes.THIRD_PARTY_RESULT_ERROR.format_prompt(args=configs.SYSTEM_NAME)

        self.response.payload = response

    def _is_legacy(self, response):
        return "bk_error_code" in response

    def _format_legacy_response(self, response):
        return {
            "result": True if response["bk_error_code"] == 0 else False,
            "code": response["bk_error_code"],
            "message": response.get("bk_error_msg", ""),
            "data": response.get("result"),
        }

    def _format_response(self, response):
        response["result"] = response["code"] == 0
        return response
