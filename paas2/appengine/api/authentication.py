# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
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
