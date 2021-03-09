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

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetAppInfo(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取应用信息"
    label_en = "get application info"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        target_app_code = ListField(label="target app code", required=False)
        fields = ListField(label="fields", required=False)

        def clean(self):
            return {
                "target_app_code": ";".join(self.cleaned_data["target_app_code"]),
                "fields": ";".join(self.cleaned_data["fields"]),
            }

    def handle(self):
        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.get(
            configs.host,
            "/paas/api/v2/app_info/",
            params=self.form_data,
        )
