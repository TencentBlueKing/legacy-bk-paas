# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from common.constants import enum

LanguageEnum = enum(ZH_CN="zh-cn", EN="en")

DJANGO_LANG_TO_BK_LANG = {"zh-hans": LanguageEnum.ZH_CN, "en": LanguageEnum.EN}

BK_LANG_TO_DJANGO_LANG = {v: k for k, v in DJANGO_LANG_TO_BK_LANG.iteritems()}

# note: Add synchronization when add login api
LOGIN_API_URL_SUFFIX_LIST = [
    "is_login",
    "get_user",
    "get_all_user",
    "get_batch_user",
]
