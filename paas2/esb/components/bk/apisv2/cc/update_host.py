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

from builtins import map
import json

from common.forms import BaseComponentForm, ListField, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateHost(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新主机属性"
    label_en = "Update host property"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_host_id = ListField(label="host ids", required=True)
        data = TypeCheckField(label="data", promise_type=dict, required=False)

        def clean(self):
            data = self.cleaned_data
            data["data"].update(bk_host_id=",".join(map(str, data["bk_host_id"])))
            return data["data"]

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path="/api/v3/hosts/batch",
            data=json.dumps(self.form_data),
        )
