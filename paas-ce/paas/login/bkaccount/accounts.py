# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import datetime
import time
import unicodedata
import urllib

from django.conf import settings
from django.utils.translation import ugettext as _
# Avoid shadowing the login() and logout() views below.
from django.contrib.auth import (login as auth_login,
                                 logout as auth_logout)
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import redirect_to_login
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import resolve_url
from django.template.response import TemplateResponse
from django.utils.six.moves.urllib.parse import urlparse
from django.utils import timezone

from common.log import logger
from bkaccount.encryption import encrypt, decrypt, salt
from bkaccount.models import Loignlog, BkToken, UserInfo


class AccountSingleton(object):
    """
    单例基类
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not isinstance(cls._instance, cls):
            cls._instance = object.__new__(cls, *args, **kwargs)
        return cls._instance


class Account(AccountSingleton):
    """
    账号体系相关的基类Account

    提供通用的账号功能
    """
    # cookie名称
    BK_COOKIE_NAME = settings.BK_COOKIE_NAME
    # cookie 有效期，默认为1天
    BK_COOKIE_AGE = settings.BK_COOKIE_AGE
    # 登录回调链接
    REDIRECT_FIELD_NAME = 'c_url'
    # 登录连接
    BK_LOGIN_URL = str(settings.LOGIN_URL)
    # 允许误差时间，防止多台机器时间误差， 1分钟
    BK_TOKEN_OFFSET_ERROR_TIME = settings.BK_TOKEN_OFFSET_ERROR_TIME

    def is_safe_url(self, url, host=None):
        """
        判断url是否与当前host的根域一致

        以下情况返回False：
            1)根域不一致
            2)url的scheme不为：https(s)
            3)url为空
        """
        if url is not None:
            url = url.strip()
        if not url:
            return False
        # Chrome treats \ completely as /
        url = url.replace('\\', '/')
        # Chrome considers any URL with more than two slashes to be absolute, but
        # urlparse is not so flexible. Treat any url with three slashes as unsafe.
        if url.startswith('///'):
            return False
        url_info = urlparse(url)
        # Forbid URLs like http:///example.com - with a scheme, but without a hostname.
        # In that URL, example.com is not the hostname but, a path component. However,
        # Chrome will still consider example.com to be the hostname, so we must not
        # allow this syntax.
        if not url_info.netloc and url_info.scheme:
            return False
        # Forbid URLs that start with control characters. Some browsers (like
        # Chrome) ignore quite a few control characters at the start of a
        # URL and might consider the URL as scheme relative.
        if unicodedata.category(url[0])[0] == 'C':
            return False
        url_domain = url_info.netloc.split(':')[0].split('.')[-2] if url_info.netloc else ''
        host_domain = host.split(':')[0].split('.')[-2] if host else ''
        return ((not url_info.netloc or url_domain == host_domain) and
                (not url_info.scheme or url_info.scheme in ['http', 'https']))

    def get_bk_token(self, username):
        """
        生成用户的登录态
        """
        bk_token = ''
        expire_time = int(time.time())
        # 重试5次
        retry_count = 0
        while not bk_token and retry_count < 5:
            now_time = int(time.time())
            expire_time = now_time + self.BK_COOKIE_AGE
            plain_token = '%s|%s|%s' % (expire_time, username, salt())
            bk_token = encrypt(plain_token)
            try:
                BkToken.objects.create(token=bk_token)
            except Exception as error:
                logger.exception('Login ticket failed to be saved during ticket generation, error: {}'.format(error))
                # 循环结束前将bk_token置空后重新生成
                bk_token = '' if retry_count < 4 else bk_token
            retry_count += 1
        return bk_token, datetime.datetime.fromtimestamp(expire_time, timezone.get_current_timezone())

    def _is_bk_token_valid(self, bk_token):
        """
        验证用户登录态
        """
        if not bk_token:
            error_msg = _("缺少参数bk_token")
            return False, None, error_msg
        try:
            plain_bk_token = decrypt(bk_token)
        except Exception as error:
            plain_bk_token = ''
            logger.exception("Parameter parse failed, error: {}".format(error))

        # 参数bk_token非法
        error_msg = _("参数bk_token非法")
        if not plain_bk_token:
            return False, None, error_msg

        token_info = plain_bk_token.split('|')
        if not token_info or len(token_info) < 3:
            return False, None, error_msg

        try:
            is_logout = BkToken.objects.get(token=bk_token).is_logout
        except BkToken.DoesNotExist:
            error_msg = _("不存在该bk_token的记录")
            return False, None, error_msg

        expire_time = int(token_info[0])
        now_time = int(time.time())
        # token已注销
        if is_logout:
            error_msg = _("登录态已注销")
            return False, None, error_msg
        # token有效期已过
        if now_time > expire_time + self.BK_TOKEN_OFFSET_ERROR_TIME:
            error_msg = _("登录态已过期")
            return False, None, error_msg
        # token有效期大于当前时间的有效期
        if expire_time - now_time > self.BK_COOKIE_AGE + self.BK_TOKEN_OFFSET_ERROR_TIME:
            error_msg = _("登录态有效期不合法")
            return False, None, error_msg

        username = token_info[1]
        return True, username, ""

    def is_bk_token_valid(self, request):
        bk_token = request.COOKIES.get(self.BK_COOKIE_NAME)
        return self._is_bk_token_valid(bk_token)

    def set_bk_token_invalid(self, request, response=None):
        """
        将登录票据设置为不合法
        """
        bk_token = request.COOKIES.get(self.BK_COOKIE_NAME)
        if bk_token:
            BkToken.objects.filter(token=bk_token).update(is_logout=True)
        if response is not None:
            # delete cookie
            response.delete_cookie(self.BK_COOKIE_NAME, domain=settings.BK_COOKIE_DOMAIN)
            return response
        return None

    def record_login_log(self, request, user, app_id):
        """
        记录用户登录日志
        """
        host = request.get_host()
        login_browser = request.META.get('HTTP_USER_AGENT') or 'unknown'
        # 获取用户ip
        login_ip = request.META.get('HTTP_X_FORWARDED_FOR') or 'REMOTE_ADDR'

        Loignlog.objects.record_login(user, login_browser, login_ip, host, app_id)

    def redirect_login(self, request):
        """
        重定向到登录页面.

        登录态验证不通过时调用
        """
        if request.is_ajax():
            return HttpResponse(status=401)

        path = request.build_absolute_uri()
        resolved_login_url = resolve_url(self.BK_LOGIN_URL)
        # If the login url is the same scheme and net location then just
        # use the path as the "next" url.
        login_scheme, login_netloc = urlparse(resolved_login_url)[:2]
        current_scheme, current_netloc = urlparse(path)[:2]
        if ((not login_scheme or login_scheme == current_scheme) and
                (not login_netloc or login_netloc == current_netloc)):
            path = settings.SITE_URL[:-1] + request.get_full_path()
        return redirect_to_login(
            path, resolved_login_url, self.REDIRECT_FIELD_NAME)

    def login(self, request, template_name='login/login.html',
              authentication_form=AuthenticationForm,
              current_app=None, extra_context=None):
        """
        登录页面和登录动作
        """
        redirect_field_name = self.REDIRECT_FIELD_NAME
        redirect_to = request.POST.get(redirect_field_name,
                                       request.GET.get(redirect_field_name, ''))
        app_id = request.POST.get('app_id', request.GET.get('app_id', ''))

        if request.method == 'POST':
            form = authentication_form(request, data=request.POST)
            if form.is_valid():
                return self.login_success_response(request, form, redirect_to, app_id)
        else:
            form = authentication_form(request)

        current_site = get_current_site(request)
        context = {
            'form': form,
            redirect_field_name: redirect_to,
            'site': current_site,
            'site_name': current_site.name,
            'app_id': app_id,
        }
        if extra_context is not None:
            context.update(extra_context)
        if current_app is not None:
            request.current_app = current_app

        response = TemplateResponse(request, template_name, context)
        response = self.set_bk_token_invalid(request, response)
        return response

    def logout(self, request, next_page=None):
        """
        登出并重定向到登录页面
        """
        redirect_field_name = self.REDIRECT_FIELD_NAME
        auth_logout(request)

        if (redirect_field_name in request.POST or redirect_field_name in request.GET):
            next_page = request.POST.get(redirect_field_name,
                                         request.GET.get(redirect_field_name))
            # Security check -- don't allow redirection to a different host.
            if not self.is_safe_url(url=next_page, host=request.get_host()):
                next_page = request.path

        if next_page:
            # Redirect to this page until the session has been cleared.
            response = HttpResponseRedirect(next_page)
        else:
            # Redirect to login url.
            response = HttpResponseRedirect("{}?{}".format(self.BK_LOGIN_URL, "is_from_logout=1"))

        # 将登录票据设置为不合法
        response = self.set_bk_token_invalid(request, response)
        return response

    def login_failed_response(self, request, redirect_to, app_id):
        """
        登录失败跳转，目前重定向到登录，后续可返还支持自定义的错误页面
        """
        redirect_url = self.BK_LOGIN_URL
        query = {}
        if redirect_to:
            query[self.REDIRECT_FIELD_NAME] = redirect_to
        if app_id:
            query['app_id'] = app_id
        if len(query):
            redirect_url = "{}?{}".format(self.BK_LOGIN_URL, urllib.urlencode(query))
        response = HttpResponseRedirect(redirect_url)
        response = self.set_bk_token_invalid(request, response)
        return response

    def login_success_response(self, request, user_or_form, redirect_to, app_id):
        """
        用户验证成功后，登录处理
        """
        # 判读是form还是user
        if isinstance(user_or_form, AuthenticationForm):
            user = user_or_form.get_user()
            username = user_or_form.cleaned_data.get('username', '')
        else:
            user = user_or_form
            username = user.username

        # 检查回调URL是否安全，防钓鱼
        if not self.is_safe_url(url=redirect_to, host=request.get_host()):
            redirect_to = resolve_url('{}accounts/user/list/'.format(settings.SITE_URL))
        # 设置用户登录
        auth_login(request, user)
        # 记录登录日志
        self.record_login_log(request, user, app_id)
        bk_token, expire_time = self.get_bk_token(username)
        response = HttpResponseRedirect(redirect_to)
        response.set_cookie(self.BK_COOKIE_NAME, bk_token,
                            expires=expire_time,
                            domain=settings.BK_COOKIE_DOMAIN,
                            httponly=True)
        # set cookie for app or platform
        bk_user_info, is_created = UserInfo.objects.get_or_create(user=user)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, bk_user_info.language,
                            # max_age=settings.LANGUAGE_COOKIE_AGE,
                            expires=expire_time,
                            path=settings.LANGUAGE_COOKIE_PATH,
                            domain=settings.LANGUAGE_COOKIE_DOMAIN)
        return response

    def login_redirect_response(self, request, redirect_url, is_from_logout):
        """
        登录重定向
        """
        response = HttpResponseRedirect(redirect_url)
        # 来自注销，则需清除蓝鲸bk_token
        if is_from_logout:
            response = self.set_bk_token_invalid(request, response)
        return response
