# -*- coding: utf-8 -*-
"""
账号体系相关的基类Account.

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django.conf import settings
from django.utils import translation
from django.contrib.auth import logout as auth_logout, get_user_model
from django.contrib.auth.views import redirect_to_login
from django.http import HttpResponse
from django.utils.six.moves.urllib.parse import urlparse

from common.log import logger
from common.http import http_get
from bk_i18n.constants import BK_LANG_TO_DJANGO_LANG


class AccountSingleton(object):
    """
    单例基类.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not isinstance(cls._instance, cls):
            cls._instance = object.__new__(cls, *args, **kwargs)
        return cls._instance


class Account(AccountSingleton):
    """
    账号体系相关的基类Account.
    提供通用的账号功能
    """

    if settings.LOGIN_DOMAIN:
        BK_LOGIN_URL = "http://%s/login/" % settings.LOGIN_DOMAIN
    else:
        BK_LOGIN_URL = "/login/"

    def is_bk_token_valid(self, request):
        """验证用户登录态."""
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        if not bk_token:
            return False, None
        ret, data = self.verify_bk_login(bk_token, request)
        # bk_token 无效
        if not ret:
            return False, None
        # 检查用户是否存在用户表中
        username = data.get("username", "")
        user_model = get_user_model()
        try:
            user = user_model._default_manager.get_by_natural_key(username)
        except user_model.DoesNotExist:
            user = user_model.objects.create_user(username)
        finally:
            try:
                ret, data = self.get_bk_user_info(bk_token, request)
                # 若获取用户信息失败，则用户可登录，但用户其他信息为空
                user.chname = data.get("chname", "")
                user.company = data.get("company", "")
                user.qq = data.get("qq", "")
                user.phone = data.get("phone", "")
                user.email = data.get("email", "")
                role = data.get("role", "")
                # 用户权限更新
                is_superuser = True if role == "1" else False
                user.is_superuser = is_superuser
                user.is_staff = is_superuser
                user.role = role
                user.save()
                # 设置timezone session
                request.session[settings.TIMEZONE_SESSION_KEY] = data.get("time_zone")
                # 设置language session
                request.session[translation.LANGUAGE_SESSION_KEY] = BK_LANG_TO_DJANGO_LANG[data.get("language")]
            except Exception as e:
                # 获取记录用户信息失败：%s
                logger.error(u"Get user information record failed：%s" % e)
        return True, user

    def verify_bk_login(self, bk_token, request):
        """请求平台接口验证登录是否失效"""
        param = {"bk_token": bk_token}
        if settings.LOGIN_DOMAIN:
            verfy_url = "%saccounts/is_login/" % self.BK_LOGIN_URL
        else:
            verfy_url = "%s/login/accounts/is_login/" % settings.LOGIN_HOST

        result, resp = http_get(verfy_url, param)
        resp = resp if result and resp else {}
        ret = resp.get("result", False)
        # 验证失败
        if not ret:
            # 验证用户登录token无效
            logger.info(u"Verification of user login token is invalid: %s" % resp.get("message", ""))
            return False, {}
        return True, resp.get("data", {})

    def get_bk_user_info(self, bk_token, request):
        """请求平台接口获取用户信息"""
        param = {"bk_token": bk_token}
        if settings.LOGIN_DOMAIN:
            get_user_url = "%saccounts/get_user/" % self.BK_LOGIN_URL
        else:
            get_user_url = "%s/login/accounts/get_user/" % settings.LOGIN_HOST

        result, resp = http_get(get_user_url, param)
        resp = resp if result and resp else {}
        ret = resp.get("result", False) if result and resp else False
        # 获取用户信息失败
        if not ret:
            # 请求平台接口获取用户信息失败
            msg = resp.get("message", "")
            logger.error(u"Get user information from the request platform interface failed: %s" % msg)
            return False, {}
        return True, resp.get("data", {})

    def build_callback_url(self, request, jump_url):
        callback = request.build_absolute_uri()
        login_scheme, login_netloc = urlparse(jump_url)[:2]
        current_scheme, current_netloc = urlparse(callback)[:2]
        if (not login_scheme or login_scheme == current_scheme) and (
            not login_netloc or login_netloc == current_netloc
        ):
            callback = request.get_full_path()
        return callback

    def _redirect_login(self, request, is_login=True):
        """
        跳转平台进行登录
        """
        login_url = self.BK_LOGIN_URL
        if is_login:
            # 登录
            callback = self.build_callback_url(request, self.BK_LOGIN_URL)
        else:
            # 登出
            login_url = "%s?%s" % (self.BK_LOGIN_URL, "is_from_logout=1")
            callback = self.http_referer(request)
        return redirect_to_login(callback, login_url, settings.REDIRECT_FIELD_NAME)

    def redirect_login(self, request):
        """
        重定向到登录页面.
        登录态验证不通过时调用
        """
        # ajax跳401
        if request.is_ajax():
            return HttpResponse(status=401)
        # 非ajax请求 跳转至平台登录
        return self._redirect_login(request)

    def http_referer(self, request):
        """
        获取 HTTP_REFERER 头，得到登出后要重新登录跳转的url
        """
        if "HTTP_REFERER" in request.META:
            http_referer = request.META["HTTP_REFERER"]
        else:
            http_referer = settings.LOGIN_REDIRECT_URL
        return http_referer

    def logout(self, request):
        """登出并重定向到登录页面."""
        auth_logout(request)
        return self._redirect_login(request, False)
