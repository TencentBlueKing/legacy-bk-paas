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

from common.constants import API_TYPE_Q
from components.component import ConfComponent
from .toolkit import configs


class UsermanageComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        extra_params = {}
        username = self.request.kwargs.get("username")
        if username:
            extra_params["username"] = username

        request_info = self.get_request_info(extra_params=extra_params)
        # request_info = self.get_request_info()

        response = self.outgoing.http_client.request(
            self.dest_http_method,
            host=configs.host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
            response_encoding="utf-8",
            with_jwt_header=True,
            headers={
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
                "Content-Type": "application/json",
            },
        )

        self.response.payload = response
