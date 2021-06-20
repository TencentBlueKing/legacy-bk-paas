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
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import configs


class VerifyAccessToken(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"验证 AccessToken"
    label_en = "verify access_token"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        access_token = forms.CharField(label="access token", required=True)

    def handle(self):
        result = self.http_client.post(
            host=configs.host,
            path='/api/v1/auth/access-tokens/verify',
            data=self.form_data,
            headers=configs.headers,
        )

        result['result'] = result['code'] == 0

        self.response.payload = result
