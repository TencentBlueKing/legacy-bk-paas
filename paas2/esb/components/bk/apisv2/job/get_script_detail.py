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

from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component

from .toolkit import tools, configs


class GetScriptDetail(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"查询脚本详情"
    label_en = "Get Script Detail"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=False)
        id = forms.IntegerField(label="script id", required=True)

        def clean(self):
            data = self.cleaned_data
            params = self.get_cleaned_data_when_exist(keys=["bk_biz_id"])
            params["params"] = {
                "id": data["id"],
            }
            return params

    def handle(self):
        params = tools.get_action_params(
            action="get_script_detail",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_script_detail", data=params, bk_language=self.request.bk_language
        )
