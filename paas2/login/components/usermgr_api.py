# -*- coding: utf-8 -*-
"""
usermgr api
"""
from __future__ import unicode_literals

from django.conf import settings

from http import http_post, http_get
from common.log import logger


BK_USERMGR_HOST = "%s://%s" % ("http", settings.BK_USERMGR_HOST)


def _call_usermgr_api(http_func, url, data, headers=None):
    # TODO: 后续添加Token Header进行服务间认证
    try:
        ok, _data = http_func(url, data, headers=headers)
        if not ok:
            return False, -1, "verify from usermgr server fail", None
    except Exception:
        logger.exception("_call_usermgr_api fail: url=%s, data=%s", url, data)
        return False, -1, "verify from usermgr server fail", None

    if not _data.get("result"):
        if data and "password" in data:
            data["password"] = "******"
        logger.info("_call_usermgr_api fail: url=%s, data=%s, _data=%s", url, data, _data)
        return False, _data.get("code", -1), _data.get("message", "usermgr api fail"), _data.get("data")

    return True, 0, "ok", _data.get("data")


def authenticate(username, password, language="", domain=""):
    """
    认证用户名和密码
    username: 用户名、电话号码、邮箱三选一，如果存在重名，会验证失败
    """
    path = "/api/v1/login/check/"
    url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    data = {
        "username": username,
        "password": password,
    }
    if domain:
        data["domain"] = domain

    ok, code, message, _data = _call_usermgr_api(
        http_post,
        url,
        data,
        headers={
            "Blueking-Language": language,
            "Content-Type": "application/json",
        },
    )
    return ok, code, message, _data


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

    ok, _, message, _data = _call_usermgr_api(http_post, url, data)
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
    ok, _, message, _data = _call_usermgr_api(http_post, url, data)
    return ok, message, _data


def get_categories():
    path = "/api/v2/categories/"
    url = "{host}{path}".format(host=BK_USERMGR_HOST, path=path)

    data = {
        "no_page": True,
        "fields": "domain,id,default",
        "lookup_field": "enabled",
        "exact_lookups": True,
    }

    ok, _, message, _data = _call_usermgr_api(http_get, url, data)
    return ok, message, _data
