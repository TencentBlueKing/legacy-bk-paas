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

from rest_framework import authentication
from rest_framework import exceptions

from api.models import BkAppToken, BkServer


class AppAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        """
        Authenticate the request for app!
        """
        x_app_token = request.META.get("HTTP_X_APP_TOKEN")
        x_app_code = request.META.get("HTTP_X_APP_CODE")
        path_info = request.META.get("PATH_INFO")
        if path_info == "/v1/apps/init":
            return None, None

        if not x_app_token:
            raise exceptions.AuthenticationFailed("app token missing")

        try:
            app = BkAppToken.objects.get(key=x_app_token).bk_app
            app_code = app.app_code
            if not x_app_code == app_code:
                raise exceptions.AuthenticationFailed("app_token with app_code not match")
        except Exception:
            raise exceptions.AuthenticationFailed("Valid token or app")
        return app, None


class AgentAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        """
        Authenticate the agent on server!
        """
        x_server_id = request.META.get("HTTP_X_ID")
        x_token = request.META.get("HTTP_X_TOKEN")
        if not x_token:
            raise exceptions.AuthenticationFailed("server token and server id  not match")

        try:
            server = BkServer.objects.get(token=x_token, s_id=x_server_id)
            if not server:
                raise exceptions.AuthenticationFailed("server token and server id   not match")
        except Exception:
            raise exceptions.AuthenticationFailed("server token and server id   not match")

        return server, None
