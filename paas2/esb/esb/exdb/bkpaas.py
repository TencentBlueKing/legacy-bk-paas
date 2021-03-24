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

from builtins import object
from cachetools import cached, TTLCache

from esb.bkcore.models import AppAccount
from esb.exdb.models import App


class AppSecureInfo(object):
    """
    Helper for AppSecureInfo
    """

    @classmethod
    @cached(cache=TTLCache(maxsize=2000, ttl=300))
    def get_by_app_code(cls, app_code):
        secure_key_list = []

        # get secret from paas
        app = App.objects.filter(code=app_code).first()
        if app:
            secure_key_list.append(app.auth_token)

        # get secret from esb
        app = AppAccount.objects.filter(app_code=app_code).first()
        if app:
            secure_key_list.append(app.app_token)

        return {"app_code": app_code, "secure_key_list": secure_key_list} if secure_key_list else None
