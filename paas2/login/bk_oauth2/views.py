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


from __future__ import unicode_literals

from django.utils.translation import ugettext as _
from oauth2_provider.views.generic import ProtectedResourceView

from common import usermgr
from common.mixins.exempt import LoginExemptMixin
from api.utils import APIV3FailJsonResponse, APIV3OKJsonResponse
from api.constants import ApiErrorCodeEnumV3


class UserView(LoginExemptMixin, ProtectedResourceView):
    def get(self, request):
        """
        获取用户信息API

        只能拿取授权用户(from access_token)的信息
        """
        username = request.resource_owner.username

        # use the raw data from usermgr
        ok, message, data = usermgr.get_user(username, "v3")
        if not ok:
            return APIV3FailJsonResponse(message, code=ApiErrorCodeEnumV3.USER_NOT_EXISTS)

        return APIV3OKJsonResponse(_("用户信息获取成功"), data=data)
