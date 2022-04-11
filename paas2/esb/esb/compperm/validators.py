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

from cachetools import cached, TTLCache
from django.conf import settings

from common.base_validators import BaseValidator
from common.errors import error_codes
from esb.bkcore.models import AppComponentPerm


class ComponentPermValidator(BaseValidator):
    def validate(self, request):
        if getattr(request, "__esb_skip_comp_perm__", False):
            return

        app_code = request.g.app_code
        channel_conf = request.g.channel_conf

        if channel_conf.get("perm_level") in (None, 0) or channel_conf.get("id") is None:
            return

        if not self._has_permission(app_code, channel_conf["id"]):
            raise error_codes.APP_PERMISSION_DENIED.format_prompt(
                "APP has no permission to access the component ({component_name}) of the system ({system_name}). "
                "The APP manager can go to the Developer Center and apply for permission to access the component".format(  # noqa
                    system_name=request.g.system_name,
                    component_name=request.g.component_alias_name,
                )
            )

    @cached(
        cache=TTLCache(
            maxsize=getattr(settings, "ESB_COMPONENT_PERMISSION_CACHE_MAXSIZE", 2000),
            ttl=getattr(settings, "ESB_COMPONENT_PERMISSION_CACHE_TTL_SECONDS", 300),
        )
    )
    def _has_permission(self, app_code, component_id):
        return AppComponentPerm.objects.filter(app_code=app_code, component_id=component_id).exists()
