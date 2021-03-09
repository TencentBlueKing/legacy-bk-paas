# -*- coding: utf-8 -*-

from __future__ import unicode_literals


def enum(**enums):
    return type(str("Enum"), (), enums)


DATETIME_FORMAT_STRING = "%Y-%m-%d %H:%M:%S"

LICENSE_VAILD_CACHE_KEY = "BK_LICENSE_VALID"


# 用户管理与登录自身提供的用户信息字段KeyMap
USERMGR_BKLOGIN_FIELD_MAP = {
    "display_name": "chname",
    "telephone": "phone",
    "wx_id": "wx_userid",
    "email": "email",
    "role": "role",
    "language": "language",
    "time_zone": "time_zone",
    "qq": "qq",
}

BKLOGIN_USERMGR_FIELD_MAP = dict((v, k) for k, v in USERMGR_BKLOGIN_FIELD_MAP.iteritems())
