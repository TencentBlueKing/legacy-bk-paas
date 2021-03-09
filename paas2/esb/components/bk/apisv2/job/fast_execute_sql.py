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

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component

from .toolkit import tools, configs


class FastExecuteSql(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"快速执行SQL脚本"
    label_en = "Fast execute SQL"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        script_id = forms.IntegerField(label="script id", required=False)
        script_content = forms.CharField(label="script content", required=False)
        script_timeout = forms.IntegerField(label="script timeout", required=False)
        db_account_id = forms.IntegerField(label="db account id", required=True)
        custom_query_id = TypeCheckField(label="custom query id", promise_type=list, required=False)
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=False)
        bk_callback_url = forms.CharField(label="callback url", required=False)

        def clean(self):
            data = self.cleaned_data
            param_keys = [
                "script_id",
                "script_content",
                "script_timeout",
                "db_account_id",
                "custom_query_id",
                "ip_list",
            ]
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": self.get_cleaned_data_when_exist(param_keys),
                "bk_callback_url": data["bk_callback_url"],
            }

    def handle(self):
        params = tools.get_action_params(
            action="fast_execute_sql",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/fast_execute_sql", data=params, bk_language=self.request.bk_language
        )
