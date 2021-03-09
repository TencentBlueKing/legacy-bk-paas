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

import json

from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class BindRolePrivilege(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"绑定角色权限"
    label_en = "bind role privilege"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=True)
        bk_obj_id = forms.CharField(label="bk obj id", required=True)
        bk_property_id = forms.CharField(label="bk property id", required=True)
        data = ListField(label="data", required=False)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            self.host,
            path="/api/v3/topo/privilege/{bk_supplier_account}/{bk_obj_id}/{bk_property_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
