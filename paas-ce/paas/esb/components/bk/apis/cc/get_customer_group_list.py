# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetCustomerGroupList(Component):
    """
    apiLabel 获取业务动态分组
    apiMethod GET

    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        application_ids = ListField(label='business IDs', required=True)
        type = forms.IntegerField(label='type', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ApplicationIDs': ','.join(data['application_ids']),
                'Type': data['type'],
            }

    def handle(self):
        client = tools.CCClient(self)
        result = client.post_request(
            self.host,
            '/api/CustomerGroup/getCustomerGroupList',
            data=self.form_data,
        )
        self.response.payload = result
