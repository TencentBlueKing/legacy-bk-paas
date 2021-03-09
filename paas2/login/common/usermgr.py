# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from cachetools import cached, TTLCache

from components import usermgr_api
from common.constants import BKLOGIN_USERMGR_FIELD_MAP
from common.log import logger


def _user_info(usermgr_userinfo):
    """
    用户信息转换
    """
    return {
        "username": usermgr_userinfo.get("username"),
        "chname": (usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["chname"]) or usermgr_userinfo.get("chname") or ""),
        "qq": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["qq"]) or "",
        "phone": (usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["phone"]) or usermgr_userinfo.get("phone") or ""),
        "email": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["email"]) or "",
        "role": str(usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["role"])) or "",
        "wx_userid": (
            usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["wx_userid"]) or usermgr_userinfo.get("wx_userid") or ""
        ),
        "language": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["language"]) or "",
        "time_zone": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["time_zone"]) or "",
    }


def _user_info_v2(usermgr_userinfo):
    """
    用户信息转换
    """
    return {
        "bk_username": usermgr_userinfo.get("username"),
        "chname": (usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["chname"]) or usermgr_userinfo.get("chname") or ""),
        "qq": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["qq"]) or "",
        "phone": (usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["phone"]) or usermgr_userinfo.get("phone") or ""),
        "email": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["email"]) or "",
        "bk_role": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["role"]) or 0,
        "wx_userid": (
            usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["wx_userid"]) or usermgr_userinfo.get("wx_userid") or ""
        ),
        "language": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["language"]) or "",
        "time_zone": usermgr_userinfo.get(BKLOGIN_USERMGR_FIELD_MAP["time_zone"]) or "",
    }


def _batch_query_users(username_list, version=None):
    """
    转换数据
    """
    if version == "v1":
        user_info_func = _user_info
    elif version == "v2":
        user_info_func = _user_info_v2
    else:
        # v3 or None, will not change the return fields
        user_info_func = None

    ok, message, data = usermgr_api.batch_query_users(username_list=username_list)
    if data and len(data) and (user_info_func is not None):
        data = [user_info_func(i) for i in data]
    return ok, message, data


# def get_raw_user(username):
#     ok, message, _data = _batch_query_users(username_list=[username])
#     if ok:
#         # 判断是否能拿到数据
#         if not _data or len(_data) != 1:
#             return False, "user do not exists", {}
#         _data = _data[0]
#     return ok, message, _data


def get_user(username, version="v1"):
    """
    获取单个用户信息
    """
    ok, message, _data = _batch_query_users(username_list=[username], version=version)
    if ok:
        # 判断是否能拿到数据
        if not _data or len(_data) != 1:
            return False, "user do not exists", {}
        _data = _data[0]
    return ok, message, _data


def get_categories():
    try:
        ok, message, _data = usermgr_api.get_categories()
    except Exception:
        logger.exception("usermgr_api get_categories fail")
        return []

    if not ok:
        logger.error("login get categories from usermgr fail: %s", message)
        return []

    default_cats = [d for d in _data if d.get("default")]
    cats = [d for d in _data if not d.get("default")]
    default_cats.extend(cats)

    data = []
    for c in default_cats:
        data.append(
            {
                "id": c.get("id"),
                "domain": c.get("domain"),
                "is_default": c.get("default", False),
            }
        )

    return data


@cached(cache=TTLCache(maxsize=1024, ttl=60))
def get_categories_str():
    categories = get_categories()

    if not categories:
        return ""

    return ";".join([c.get("domain") for c in categories])
