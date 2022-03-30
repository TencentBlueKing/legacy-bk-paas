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
from __future__ import absolute_import

# from django.conf import settings

from .http import http_post, http_get
from .esb import _call_esb_api
# from common.log import logger

"""
usermgr api
"""

# BK_USERMGR_HOST = "%s://%s" % ("http", settings.BK_USERMGR_HOST)


# def _call_usermgr_api(http_func, url, data, headers=None):
#     # TODO: 后续添加Token Header进行服务间认证
#     try:
#         ok, _data = http_func(url, data, headers=headers)
#         if not ok:
#             return False, -1, "verify from usermgr server fail", None
#     except Exception:
#         logger.exception("_call_usermgr_api fail: url=%s, data=%s", url, data)
#         return False, -1, "verify from usermgr server fail", None

#     if not _data.get("result"):
#         if data and "password" in data:
#             data["password"] = "******"
#         logger.info("_call_usermgr_api fail: url=%s, data=%s, _data=%s", url, data, _data)
#         return False, _data.get("code", -1), _data.get("message", "usermgr api fail"), _data.get("data")

#     return True, 0, "ok", _data.get("data")


def authenticate(username, password, language="", domain=""):
    """
    认证用户名和密码
    username: 用户名、电话号码、邮箱三选一，如果存在重名，会验证失败
    """
    # path = "/api/v1/login/check/"
    # url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    path = "/api/c/compapi/v1/usermanage/login/check/"

    data = {
        "username": username,
        "password": password,
    }
    if domain:
        data["domain"] = domain

    # ok, code, message, _data = _call_usermgr_api(
    #     http_post,
    #     url,
    #     data,
    #     headers={
    #         "Blueking-Language": language,
    #         "Content-Type": "application/json",
    #     },
    # )
    ok, code, message, _data = _call_esb_api(http_post, path, data)
    return ok, code, message, _data


def batch_query_users(username_list=[], is_complete=False):
    """
    批量获取用户，可以获取所有
    """
    # path = "/api/v1/login/profile/query/"
    # url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    path = "/api/c/compapi/v1/usermanage/login/profile/query/"

    data = {
        "username_list": username_list,
        "is_complete": is_complete,
    }

    # ok, _, message, _data = _call_usermgr_api(http_post, url, data)
    ok, _, message, _data = _call_esb_api(http_post, path, data)
    return ok, message, _data


def upsert_user(username, **kwargs):
    """
    创建或更新用户
    主要用于ee_login，企业第三方应用某些情况下需要支持将用户存储到用户管理
    """
    # path = "/api/v1/login/profile/"
    # url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)
    path = "/api/c/compapi/v1/usermanage/login/profile/"

    data = {
        "username": username,
    }
    data.update(kwargs)
    # ok, _, message, _data = _call_usermgr_api(http_post, url, data)
    ok, _, message, _data = _call_esb_api(http_post, path, data)
    return ok, message, _data


def get_categories():
    # path = "/api/v2/categories/"
    # url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)
    path = "/api/c/compapi//v2/usermanage/list_categories/"

    data = {
        "no_page": True,
        "fields": "domain,id,default",
        "lookup_field": "enabled",
        "exact_lookups": True,
    }

    # ok, _, message, _data = _call_usermgr_api(http_get, url, data)
    ok, _, message, _data = _call_esb_api(http_get, path, data)
    return ok, message, _data
