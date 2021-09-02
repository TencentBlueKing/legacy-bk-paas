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

import copy

from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component, SetupConfMixin
from .toolkit import configs


class FsListUsers(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.GET
    label = u"查询用户列表（前端人员选择人特别组件）"
    label_en = "list users for frontend"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def _get_list_users_params(self):
        params = copy.deepcopy(self.request.kwargs)
        params.update(
            {
                "no_page": False,
                "best_match": 1,
                "fields": ",".join(
                    [
                        "id",
                        "username",
                        "display_name",
                        "domain",
                        "category_id",
                        "logo",
                        "staff_status",
                    ]
                ),
            }
        )
        return params

    def handle(self):
        # 获取用户信息
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs=self._get_list_users_params(),
        )
        comp_obj.setup_conf(
            {
                "name": "list_users",
                "dest_path": "/api/v2/profiles/",
                "dest_http_method": "GET",
            }
        )
        users_result = comp_obj.invoke()
        if not users_result["result"]:
            self.response.payload = users_result
            return

        # 获取全量的 category 信息
        category_id_map = self._get_category_id_map()

        # 将 category 信息更新到用户信息
        for user in users_result["data"].get("results", []):
            category = category_id_map.get(user["category_id"]) or {}
            user["category_name"] = category.get("display_name", "")

        self.response.payload = users_result

    def _get_category_id_map(self):
        # 获取 category 信息
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs={
                "no_page": True,
                "fields": ",".join(
                    [
                        "id",
                        "display_name",
                    ]
                ),
            },
        )
        comp_obj.setup_conf(
            {
                "name": "list_categories",
                "dest_path": "/api/v2/categories/",
                "dest_http_method": "GET",
            }
        )
        categories_result = comp_obj.invoke()
        return dict([(category["id"], category) for category in categories_result.get("data") or []])
