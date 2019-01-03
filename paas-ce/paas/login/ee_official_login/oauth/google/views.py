# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import urlparse

from django.contrib.auth import authenticate

from bkaccount.accounts import Account
from .utils import gen_oauth_login_url


def login(request):
    """
    登录处理
    """
    account = Account()
    # 获取用户实际请求的URL, 目前account.REDIRECT_FIELD_NAME = 'c_url'
    redirect_to = request.GET.get(account.REDIRECT_FIELD_NAME, '')
    # 获取用户实际访问的蓝鲸应用
    app_id = request.GET.get('app_id', '')

    # 来自注销
    is_from_logout = bool(request.GET.get('is_from_logout') or 0)

    # google登录回调后会自动添加code参数
    code = request.GET.get('code')
    # 若没有code参数，则表示需要跳转到google登录
    if code is None or is_from_logout:
        # 生成跳转到google登录的链接
        google_oauth_login_url, state = gen_oauth_login_url({
            'app_id': app_id,
            account.REDIRECT_FIELD_NAME: redirect_to
        })
        # 将state 设置于session，Oauth2.0特有的，防止csrf攻击的
        request.session['state'] = state
        # 直接调用蓝鲸登录重定向方法
        response = account.login_redirect_response(request, google_oauth_login_url, is_from_logout)
        return response

    # 已经有企业认证票据参数（如code参数），表示企业登录后的回调或企业认证票据还存在
    # oauth2.0 特有处理逻辑，防止csrf攻击
    # 处理state参数
    state = request.GET.get('state', '')
    state_dict = dict(urlparse.parse_qsl(state))
    app_id = state_dict.get('app_id')
    redirect_to = state_dict.get(account.REDIRECT_FIELD_NAME, '')
    state_from_session = request.session.get('state')
    # 校验state，防止csrf攻击
    if state != state_from_session:
        return account.login_failed_response(request, redirect_to, app_id)

    # 验证用户登录是否OK
    user = authenticate(code=code)
    if user is None:
        # 直接调用蓝鲸登录失败处理方法
        return account.login_failed_response(request, redirect_to, app_id)
    # 成功，则调用蓝鲸登录成功的处理函数，并返回响应
    return account.login_success_response(request, user, redirect_to, app_id)
