# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import urllib
import random

import requests
from django.conf import settings as bk_settings

from common.log import logger
from . import settings as google_setting


def gen_oauth_state_security_token(length=32):
    """
    生成随机的state，防止csrf
    """
    allowed_chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
    state = ''.join(random.choice(allowed_chars) for _ in range(length))
    return state


def gen_oauth_login_url(extra_param):
    """
    生成跳转登录的URL
    """
    # 由于google校验redirect_uri是精准匹配的，所有redirect_uri中无法带参数，只能放置在state中处理
    extra_param = {} if extra_param is None or not isinstance(extra_param, dict) else extra_param
    extra_param['security_token'] = gen_oauth_state_security_token()
    state = '&'.join(["%s=%s" % (k, v) for k, v in extra_param.items() if v is not None and v != ""])
    # 跳转到 google 登录的URL
    google_oauth_login_url = '%s?%s' % (
        google_setting.GOOGLE_OAUTH_LOGIN_URL,
        urllib.urlencode({'response_type': 'code',
                          'client_id': google_setting.CLIENT_ID,
                          'redirect_uri': bk_settings.LOGIN_COMPLETE_URL,
                          'scope': 'email',
                          'state': state})
    )
    return google_oauth_login_url, state


def get_access_token(code):
    """
    调用接口验证CODE，并获取access_token
    """
    params = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": bk_settings.LOGIN_COMPLETE_URL,
        "client_id": google_setting.CLIENT_ID,
        "client_secret": google_setting.CLIENT_SECRET

    }
    resp = requests.post(url=google_setting.ACCESS_TOKEN_URL, params=params)
    if resp.status_code != 200:
        # 记录错误日志
        content = resp.content[:100] if resp.content else ''
        error_msg = ("http enterprise request error! type: %s, url: %s, data: %s, "
                     "response_status_code: %s, response_content: %s")
        logger.error(error_msg % ('POST', google_setting.ACCESS_TOKEN_URL, str(params), resp.status_code, content))
        return None
    data = resp.json()
    return data.get('access_token')


def get_scope_data(access_token):
    """
    scope要求的数据
    """
    params = {
        'access_token': access_token
    }
    resp = requests.get(google_setting.SCOPE_URL, params=params)
    if resp.status_code != 200:
        # 记录错误日志
        content = resp.content[:100] if resp.content else ''
        error_msg = ("http enterprise request error! type: %s, url: %s, data: %s, "
                     "response_status_code: %s, response_content: %s")
        logger.error(error_msg % ('GET', google_setting.SCOPE_URL, str(params), resp.status_code, content))
        return None
    data = resp.json()
    userinfo = {
        'username': data.get('email', ''),
        'email': data.get('email', ''),
        'chname': data.get('email', ''),
        'phone': data.get('phone', ''),
    }
    return userinfo
