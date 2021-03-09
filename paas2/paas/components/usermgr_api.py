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

from django.conf import settings

from http import http_post
from common.log import logger


BK_USERMGR_HOST = "%s://%s" % ("http", settings.BK_USERMGR_HOST)


def _call_usermgr_api(http_func, url, data):
    # TODO: 后续添加Token Header进行服务间认证
    ok, _data = http_func(url, data)
    if not ok:
        return False, "verify from usermgr server fail", None

    if not _data.get("result"):
        logger.info("_call_usermgr_api fail: url=%s, data=%s, _data=%s", url, data, _data)
        return False, _data.get("message", "usermgr api fail"), None

    _d = _data.get("data")

    return True, "ok", _d


def batch_query_users(username_list=[], is_complete=False):
    """
    批量获取用户，可以获取所有
    """
    path = "/api/v1/login/profile/query/"
    url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    data = {
        "username_list": username_list,
        "is_complete": is_complete,
    }

    ok, message, _data = _call_usermgr_api(http_post, url, data)
    return ok, message, _data


def upsert_user(username, **kwargs):
    """
    创建或更新用户
    主要用于ee_login，企业第三方应用某些情况下需要支持将用户存储到用户管理
    """
    path = "/api/v1/login/profile/"
    url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    data = {
        "username": username,
    }
    data.update(kwargs)
    # for bklogin_field, usermgr_field in BKLOGIN_USERMGR_FIELD_MAP.iteritems():
    #     if kwargs.get(bklogin_field):
    #         data[usermgr_field] = kwargs[bklogin_field]
    ok, message, _data = _call_usermgr_api(http_post, url, data)
    return ok, message, _data


# # 用户管理与登录自身提供的用户信息字段KeyMap
# USERMGR_BKLOGIN_FIELD_MAP = {
#     'show_name': 'chname',
#     'telephone': 'phone',
#     'email': 'email',
#     'role': 'role',
#     'language': 'language',
#     'time_zone': 'time_zone',
#     'wx_id': 'wx_userid'
# }

# BKLOGIN_USERMGR_FIELD_MAP = dict((v, k) for k, v in USERMGR_BKLOGIN_FIELD_MAP.iteritems())
