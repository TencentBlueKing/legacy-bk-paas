# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import os

from django.conf import settings
from django.views.generic import View
from django.utils.translation import ugettext as _

from common.mixins.exempt import LoginExemptMixin
from common.exceptions import LoginErrorCodes
from common.responses import ApiV2FailJsonResponse, ApiV2OKJsonResponse


class HealthzView(LoginExemptMixin, View):
    """health check for login
    """
    def _check_settings(self):
        """
        check settings, 注意不暴露密码等敏感信息
        """
        # check settings, 注意不暴露密码等敏感信息
        try:
            settings.ESB_TOKEN
            {
                'debug': settings.DEBUG,
                'env': os.getenv("BK_ENV", "unknow"),
                'cookie_domain': settings.BK_COOKIE_DOMAIN,

                'mysql': {
                    'host': settings.DATABASES.get("default", {}).get("HOST"),
                    'port': settings.DATABASES.get("default", {}).get("PORT"),
                    'user': settings.DATABASES.get("default", {}).get("USER"),
                    'database': settings.DATABASES.get("default", {}).get("NAME")
                }
            }
        except Exception as error:
            return False, _("配置文件不正确, 缺失对应配置: {}").format(error), LoginErrorCodes.E1302001_BASE_SETTINGS_ERROR

        return True, "ok", 0

    def _check_database(self):
        try:
            from bkaccount.models import BkUser
            objs = BkUser.objects.all()
            [o.username for o in objs]
        except Exception as error:
            return False, _("数据库连接存在问题: {}").format(error), LoginErrorCodes.E1302002_BASE_DATABASE_ERROR

        return True, "ok", 0

    def get(self, request):
        data = {}
        # 强依赖
        _check_funcs = [
            ("settings", self._check_settings),
            ("database", self._check_database),
        ]
        for name, func in _check_funcs:
            is_health, message, code = func()
            if not is_health:
                return ApiV2FailJsonResponse(message, code=code)
            data[name] = "ok"
        return ApiV2OKJsonResponse("", data=data)
