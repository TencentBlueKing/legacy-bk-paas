# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings

from common.http import http_get, http_post, http_delete, http_put
from common.log import logger
from django.utils.translation import ugettext as _


def _call_login_api(http_func, api, data, kwargs={}):
    # 获取统一登录接口请求URL前缀
    if settings.LOGIN_DOMAIN:
        url_prefix = "http://{}/login/accounts/".format(settings.LOGIN_DOMAIN)
    else:
        url_prefix = "{}/accounts/".format(settings.LOGIN_HOST)

    url = "{}{}/".format(url_prefix, api)
    ok, resp = http_func(url, data, **kwargs)
    message = resp.get("message", "") if (ok and resp) else ""
    data = resp.get("data", {}) if (ok and resp) else {}

    if not (ok and resp and resp.get("result")):
        logger.error("请求login接口失败: method=%s, api=%s, message=%s", http_func.func_name, api, message)
        return False, message, data

    return True, message, data


def get_all_users(bk_token):
    """获取所有用户的信息
    """
    param = {'bk_token': bk_token}
    ok, message, data = _call_login_api(http_get, 'get_all_user', param)
    if not ok:
        return False, []
    return True, data or []


def get_user_info(bk_token):
    """请求平台接口获取用户信息
    """
    param = {'bk_token': bk_token}
    ok, message, data = _call_login_api(http_get, 'get_user', param)
    if not ok:
        return False, []
    return True, data


def verify_bk_login(bk_token):
    """请求平台接口验证登录是否失效
    """
    param = {'bk_token': bk_token}
    ok, message, data = _call_login_api(http_get, 'is_login', param)
    if not ok:
        return False, {}
    return True, data


def modify_user_info(bk_token, data):
    ok, message, data = _call_login_api(http_post, 'user/baseinfo', data, {'cookies': {'bk_token': bk_token}})
    if not ok:
        return False, message
    return True, "success"


def change_password(bk_token, data):
    ok, message, data = _call_login_api(http_put, 'user/password', data, {'cookies': {'bk_token': bk_token}})
    if not ok:
        return False, message
    return True, "success"


def bind_wx_user_info(bk_token, wx_userid):
    """调用统一登录接口绑定用户微信信息
    """
    data = {'wx_userid': wx_userid}
    ok, message, data = _call_login_api(http_post, 'user/weixin_info', data, {'cookies': {'bk_token': bk_token}})
    if not ok:
        message = _("绑定用户微信失败")
    return ok, message


def unbind_wx_user_info(bk_token):
    """
    调用统一登录接口解绑微信信息
    """
    ok, message, data = _call_login_api(http_delete, 'user/weixin_info', None, {'cookies': {'bk_token': bk_token}})
    if not ok:
        message = _("解绑用户微信失败")
    return ok, message
