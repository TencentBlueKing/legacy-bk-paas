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
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from esb.bkcore.models import ComponentSystem, ESBChannel, ESBBuffetComponent

from .toolkit import configs


class GetSystems(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取系统列表"
    label_en = "Get systems"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        systems = ComponentSystem.objects.all()
        systems_has_channel = []

        bk_language = self.request.headers.get("Blueking-Language", "en")
        with translation.override(bk_language):
            for system in systems:
                has_channel = ESBChannel.objects.filter(component_system_id=system.id, is_hidden=False).exists()
                has_buffet = ESBBuffetComponent.objects.filter(system_id=system.id).exists()
                if has_channel or has_buffet:
                    system_label = system.label
                    system_remark = system.remark
                    if system.is_official:
                        system_label = _(system_label)
                        system_remark = _(system_remark)
                    systems_has_channel.append(
                        {
                            "id": system.id,
                            "name": html_escape(system.name),
                            "label": html_escape(system_label),
                            "remark": html_escape(system_remark),
                        }
                    )

        self.response.payload = {
            "result": True,
            "data": systems_has_channel,
        }
