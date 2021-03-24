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

from future import standard_library
standard_library.install_aliases()
from builtins import str
import urllib.request, urllib.parse, urllib.error

from django.conf import settings
from django.http import HttpResponseRedirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.template.response import TemplateResponse

from bkauth.utils import set_bk_token_invalid, is_safe_url, record_login_log, get_bk_token
from bkauth.constants import REDIRECT_FIELD_NAME

"""
actions for login success/fail
"""


BK_LOGIN_URL = str(settings.LOGIN_URL)
BK_COOKIE_NAME = settings.BK_COOKIE_NAME


def login_failed_response(request, redirect_to, app_id):
    """
    登录失败跳转，目前重定向到登录，后续可返还支持自定义的错误页面
    """
    redirect_url = BK_LOGIN_URL
    query = {}
    if redirect_to:
        query[REDIRECT_FIELD_NAME] = redirect_to
    if app_id:
        query["app_id"] = app_id

    if query:
        redirect_url = "%s?%s" % (BK_LOGIN_URL, urllib.parse.urlencode(query))
    response = HttpResponseRedirect(redirect_url)
    response = set_bk_token_invalid(request, response)
    return response


def login_success_response(request, user_or_form, redirect_to, app_id):
    """
    用户验证成功后，登录处理
    """
    # 判读是form还是user
    if isinstance(user_or_form, AuthenticationForm):
        user = user_or_form.get_user()
        username = user.username
        # username = user_or_form.cleaned_data.get('username', '')
    else:
        user = user_or_form
        username = user.username

    # 检查回调URL是否安全，防钓鱼
    if not is_safe_url(url=redirect_to, host=request.get_host()):
        # 调整到根目录
        redirect_to = "/console/"

    # if from logout
    if redirect_to == "/logout/":
        redirect_to = "/console/"

    # 设置用户登录
    auth_login(request, user)
    # 记录登录日志
    record_login_log(request, username, app_id)

    secure = False
    # uncomment this if you need a secure cookie;
    # the http domain will not access the bk_token in secure cookie
    # secure = (settings.HTTP_SCHEMA == "https")
    bk_token, expire_time = get_bk_token(username)
    response = HttpResponseRedirect(redirect_to)
    response.set_cookie(
        BK_COOKIE_NAME, bk_token, expires=expire_time, domain=settings.BK_COOKIE_DOMAIN, httponly=True, secure=secure
    )

    # set cookie for app or platform
    response.set_cookie(
        settings.LANGUAGE_COOKIE_NAME,
        request.user.language,
        # max_age=settings.LANGUAGE_COOKIE_AGE,
        expires=expire_time,
        path=settings.LANGUAGE_COOKIE_PATH,
        domain=settings.LANGUAGE_COOKIE_DOMAIN,
    )
    return response


def login_redirect_response(request, redirect_url, is_from_logout):
    """
    登录重定向
    """
    response = HttpResponseRedirect(redirect_url)
    # 来自注销，则需清除蓝鲸bk_token
    if is_from_logout:
        response = set_bk_token_invalid(request, response)
    return response


def login_license_fail_response(request, template_name="account/login.html"):
    """
    证书认证，登录失败页面
    """
    response = TemplateResponse(request, template_name, {"custom_login": True})
    response = set_bk_token_invalid(request, response)
    return response
