# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from common.constants import enum

ApiErrorCodeEnum = enum(
    SUCCESS="00",
    PARAM_NOT_VALID="1200",
    USER_NOT_EXISTS="1201",
    # 做兼容
    USER_NOT_EXISTS2="1300",
    USER_INFO_UPDATE_FAIL="1202",
)

ApiErrorCodeEnumV2 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1302100,
    USER_NOT_EXISTS=1302101,
    USER_INFO_UPDATE_FAIL=1302102,
    USER_NOT_EXISTS2=1302103,
)

ApiErrorCodeEnumV3 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1302100,
    USER_NOT_EXISTS=1302101,
    USER_INFO_UPDATE_FAIL=1302102,
    USER_NOT_EXISTS2=1302103,
    RESOUCE_OWNER_MISMATCH=1302200,
)
