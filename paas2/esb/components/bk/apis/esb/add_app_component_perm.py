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

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP
from components.component import Component
from esb.bkcore.models import AppComponentPerm
from .toolkit import configs


class AddAppComponentPerm(Component):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        added_app_code = forms.CharField(label="app_code", required=True)
        component_ids = ListField(label="component IDs", required=True)

        def clean(self):
            data = self.cleaned_data
            for component_id in data["component_ids"]:
                if not component_id.isdigit():
                    raise forms.ValidationError(
                        "component IDs [component_ids] format error, in which, data must be integer"
                    )
            data["component_ids"] = [int(component_id) for component_id in data["component_ids"]]
            return data

    def handle(self):
        data = self.form_data
        added_app_code = data["added_app_code"]
        for component_id in data["component_ids"]:
            AppComponentPerm.objects.get_or_create(
                app_code=added_app_code,
                component_id=component_id,
                defaults={
                    "expires": "2050-01-01 00:00:00+00:00",
                },
            )

        self.response.payload = {"result": True, "message": "OK"}
