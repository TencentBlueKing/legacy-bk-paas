# -*- coding: utf-8 -*-
"""
Login middleware

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from __future__ import unicode_literals

from django.conf import settings
from django.shortcuts import resolve_url
from django.utils import translation
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.utils.six.moves.urllib.parse import urlparse
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth import get_user_model

from common.log import logger
from bk_i18n.constants import BK_LANG_TO_DJANGO_LANG
from bkauth.constants import REDIRECT_FIELD_NAME
from bkauth.utils import validate_bk_token


BK_LOGIN_URL = str(settings.LOGIN_URL)


def redirect_login(request):
    """
    重定向到登录页面.

    登录态验证不通过时调用
    """
    if request.is_ajax():
        return HttpResponse(status=401)

    path = request.build_absolute_uri()
    resolved_login_url = resolve_url(BK_LOGIN_URL)
    # If the login url is the same scheme and net location then just
    # use the path as the "next" url.
    login_scheme, login_netloc = urlparse(resolved_login_url)[:2]
    current_scheme, current_netloc = urlparse(path)[:2]
    if (not login_scheme or login_scheme == current_scheme) and (not login_netloc or login_netloc == current_netloc):
        path = settings.SITE_URL[:-1] + request.get_full_path()
    return redirect_to_login(path, resolved_login_url, REDIRECT_FIELD_NAME)


class LoginMiddleware(object):
    def process_request(self, request):
        """设置user"""
        # 静态资源不做登录态设置
        full_path = request.get_full_path()
        if full_path.startswith(settings.STATIC_URL) or full_path == "/robots.txt":
            return None

        # 静态资源不做登录态设置
        if full_path in [settings.SITE_URL + "i18n/setlang/", "/i18n/setlang/"]:
            return None

        user = None
        bk_token = request.COOKIES.get("bk_token")

        path_prefix = settings.FORCE_SCRIPT_NAME or ""
        if bk_token and full_path.startswith("%s/oauth/authorize/" % path_prefix):
            is_valid, username, message = validate_bk_token(request.COOKIES)
            if is_valid:
                try:
                    UserModel = get_user_model()
                    user = UserModel.objects.get(username=username)
                    user.bk_token = bk_token
                except Exception:
                    logger.exception("get user via username=%s fail", username)
                    user = None
        else:
            user = authenticate(request=request)
            if user:
                # 设置timezone session
                request.session[settings.TIMEZONE_SESSION_KEY] = user.time_zone
                # 设置language session
                request.session[translation.LANGUAGE_SESSION_KEY] = BK_LANG_TO_DJANGO_LANG[user.language]

        request.user = user or AnonymousUser()

    def process_view(self, request, view, args, kwargs):
        # 静态资源不做登录态验证
        full_path = request.get_full_path()
        if full_path.startswith(settings.STATIC_URL) or full_path == "/robots.txt":
            return None

        # 静态资源不做登录态验证
        if full_path in [
            settings.SITE_URL + "i18n/setlang/",
            "/i18n/setlang/",
            settings.SITE_URL + "jsi18n/i18n/",
            "/jsi18n/i18n/",
        ]:
            return None

        if getattr(view, "login_exempt", False):
            return None

        if request.user.is_authenticated():
            return None

        return redirect_login(request)
