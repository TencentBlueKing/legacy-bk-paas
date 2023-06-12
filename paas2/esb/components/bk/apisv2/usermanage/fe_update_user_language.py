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
from common.constants import API_TYPE_OP
from components.component import Component, SetupConfMixin
from .toolkit import configs


class FeUpdateUserLanguage(Component, SetupConfMixin):
    suggest_method = "PUT"
    label = "切换用户语言"
    label_en = "update user language"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs=self.request.kwargs,
        )
        comp_obj.setup_conf(
            {
                "name": "update_user_language",
                "dest_path": "/api/v2/profiles/{id}/languages/".format(id=self.current_user.username),
                "dest_http_method": "PUT",
            }
        )

        self.response.payload = comp_obj.invoke()