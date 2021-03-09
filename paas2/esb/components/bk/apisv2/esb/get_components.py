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

from django.utils import translation
from django.utils.translation import ugettext as _

from common.base_utils import html_escape
from components.component import Component
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q, HTTP_METHOD
from esb.bkcore.models import ComponentSystem, ESBChannel, ESBBuffetComponent

from .toolkit import configs


class GetComponents(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"获取指定系统的组件列表"
    label_en = "Get components"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        system_names = ListField(label="system name", required=True)

    def handle(self):
        system_names = self.form_data["system_names"]

        component_queryset = ESBChannel.objects.filter(component_system__name__in=system_names, is_hidden=False)
        buffet_component_queryset = ESBBuffetComponent.objects.filter(system__name__in=system_names)

        systems = self.get_systems(system_names)

        component_list = []

        bk_language = self.request.headers.get("Blueking-Language", "en")
        with translation.override(bk_language):
            for channel in component_queryset:
                is_official = systems.get(channel.component_system_id, {}).get("is_official", False)
                channel_name = channel.name
                if is_official:
                    channel_name = _(channel_name)
                component_list.append(
                    {
                        "name": channel.component_name,
                        "label": html_escape(channel_name),
                        "method": channel.extra_info_json().get("suggest_method", ""),
                        "path": channel.api_path,
                        "system_id": channel.component_system_id,
                        "system_name": channel.component_system.name,
                        "type": channel.type,
                        "version": channel.api_version,
                        "category": "component",
                    }
                )

        buffet_component_list = [
            {
                "name": buffet.api_name,
                "label": buffet.name,
                "method": buffet.registed_http_method,
                "path": buffet.api_path,
                "system_id": buffet.system_id,
                "system_name": buffet.system.name,
                "type": buffet.type,
                "version": "",
                "category": "buffet_component",
            }
            for buffet in buffet_component_queryset
        ]

        self.response.payload = {
            "result": True,
            "data": component_list + buffet_component_list,
        }

    def get_systems(self, system_names):
        systems = {}
        for system in ComponentSystem.objects.filter(name__in=system_names):
            systems[system.id] = {
                "is_official": system.is_official,
            }
        return systems
