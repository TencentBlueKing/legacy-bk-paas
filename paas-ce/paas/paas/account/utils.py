# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

账号体系相关功能函数

is_bk_token_valid
redirect_login
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth.views import redirect_to_login
from django.http import HttpResponse
from django.utils.six.moves.urllib.parse import urlparse


def redirect_login(request):
    """
    重定向到登录页面.
    登录态验证不通过时调用

    middleware
    """
    # ajax跳401
    if request.is_ajax():
        return HttpResponse(status=401)

    # 非ajax请求 跳转至平台登录
    return _redirect_login(request)


def _redirect_login(request, is_login=True):
    """
    跳转平台进行登录
    """
    if settings.LOGIN_DOMAIN:
        BK_LOGIN_URL = 'http://{}/login/'.format(settings.LOGIN_DOMAIN)
    else:
        BK_LOGIN_URL = '/login/'

    if is_login:
        # 登录
        login_url = BK_LOGIN_URL
        callback = _build_callback_url(request, BK_LOGIN_URL)
    else:
        # 登出
        login_url = "{}?{}".format(BK_LOGIN_URL, "is_from_logout=1")
        callback = _http_referer(request)

    return redirect_to_login(callback, login_url, settings.REDIRECT_FIELD_NAME)


def _build_callback_url(request, jump_url):
    callback = request.build_absolute_uri()
    login_scheme, login_netloc = urlparse(jump_url)[:2]
    current_scheme, current_netloc = urlparse(callback)[:2]
    if ((not login_scheme or login_scheme == current_scheme)
            and (not login_netloc or login_netloc == current_netloc)):
        callback = request.get_full_path()
    return callback


def _http_referer(request):
    """
    获取 HTTP_REFERER 头，得到登出后要重新登录跳转的url
    """
    if 'HTTP_REFERER' in request.META:
        http_referer = request.META['HTTP_REFERER']
    else:
        http_referer = settings.LOGIN_REDIRECT_URL
    return http_referer
