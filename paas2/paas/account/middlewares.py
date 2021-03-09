# -*- coding: utf-8 -*-
"""
Login middleware.

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.middleware.csrf import get_token as get_csrf_token

from account.accounts import Account


class LoginMiddleware(object):
    def process_request(self, request):
        # 静态资源不做登录态设置
        full_path = request.get_full_path()
        if full_path.startswith(settings.STATIC_URL) or full_path == "/robots.txt":
            return None

        user = authenticate(request=request)
        request.user = user or AnonymousUser()

    def process_view(self, request, view, args, kwargs):
        # 静态资源不做登录态验证
        full_path = request.get_full_path()
        if full_path.startswith(settings.STATIC_URL) or full_path == "/robots.txt":
            return None

        if getattr(view, "login_exempt", False):
            return None

        if request.user.is_authenticated():
            get_csrf_token(request)
            return None

        account = Account()
        return account.redirect_login(request)
