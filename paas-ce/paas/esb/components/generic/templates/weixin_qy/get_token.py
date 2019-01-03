# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetToken(Component, SetupConfMixin):
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        corpid = forms.CharField(label='corp ID', required=True)
        corpsecret = forms.CharField(label='corp secret', required=True)

    def handle(self):
        client = tools.WEIXINClient(self.outgoing.http_client)
        result = client.get(path='/cgi-bin/gettoken', params=self.form_data)
        self.response.payload = result
