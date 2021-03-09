# -*- coding: utf-8 -*-
from common.constants import enum


LanguageEnum = enum(ZH_CN="zh-cn", EN="en")

DJANGO_LANG_TO_BK_LANG = {"zh-hans": LanguageEnum.ZH_CN, "en": LanguageEnum.EN}

BK_LANG_TO_DJANGO_LANG = {v: k for k, v in DJANGO_LANG_TO_BK_LANG.iteritems()}
