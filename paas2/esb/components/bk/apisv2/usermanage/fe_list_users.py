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
from components.component import Component, SetupConfMixin
from .toolkit import configs


class FeListUsers(Component, SetupConfMixin):
    suggest_method = "GET"
    label = "fe list users"
    label_en = "fe list users"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs=self.request.kwargs,
        )
        comp_obj.setup_conf(
            {
                "name": "fe_list_users",
                "dest_http_method": "GET",
                "dest_path": "/api/v2/profiles/",
            }
        )

        result = comp_obj.invoke()

        # 去除敏感信息
        users = result["data"]
        if isinstance(users, dict):
            users = users.get("results", [])
        elif not isinstance(users, list):
            users = []

        replaced_data_for_sensitive = {
            "qq": "",
            "email": "",
            "telephone": "",
            "wx_userid": "",
            "password_valid_days": -1,
            "account_expiration_date": "",
            "create_time": "",
            "update_time": "",
            "extras": {},
        }
        for user in users:
            for key, value in replaced_data_for_sensitive.items():
                if key in user:
                    user[key] = value

        self.response.payload = result
