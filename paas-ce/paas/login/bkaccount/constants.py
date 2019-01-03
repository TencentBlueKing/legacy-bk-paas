# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals
import re

import pytz
from django.utils.translation import ugettext as _

from common.constants import enum


# 用户名校验规则：包含数字和字母，长度在4-20个字符
USERNAME_CHECK_PATTERN = re.compile(r'^[A-Za-z0-9][A-Za-z0-9._]{2,18}[A-Za-z0-9]$')
# 密码校验规则: 仅包含数字、字母或!@#$%^*()_-+=，长度在8-20个字符, 且必须同时包含大小写字母和数字
PASSWORD_CHECK_PATTERN = re.compile(r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9!@#\$%\^\*\(\)-_\+=]{8,20}$')
# 中文名校验规则：数字、字母、中文汉字、下划线，长度在1-16个字符
CHNAME_CHECK_PATTERN = re.compile(u"^[\u4e00-\u9fa5a-zA-Z0-9_]{1,16}$")
# Phone检验规则：11位数字
PHONE_CHECK_PATTERN = re.compile(r'^\d{11}$')

RoleCodeEnum = enum(
    STAFF=0,
    SUPERUSER=1,
    DEVELOPER=2,
    OPERATOR=3,
    AUDITOR=4
)

ROLECODE_CHOICES = [
    (RoleCodeEnum.STAFF, _(u"普通用户")),
    (RoleCodeEnum.SUPERUSER, _(u"超级管理员")),
    (RoleCodeEnum.DEVELOPER, _(u"开发者")),
    (RoleCodeEnum.OPERATOR, _(u"职能化用户")),
    (RoleCodeEnum.AUDITOR, _(u"审计员"))
]

ROLECODE_LIST = [
    RoleCodeEnum.STAFF,
    RoleCodeEnum.SUPERUSER,
    RoleCodeEnum.DEVELOPER,
    RoleCodeEnum.OPERATOR,
    RoleCodeEnum.AUDITOR
]


ApiErrorCodeEnum = enum(
    SUCCESS="00",
    PARAM_NOT_VALID="1200",
    USER_NOT_EXISTS="1201",
    # 做兼容
    USER_NOT_EXISTS2="1300",
    USER_INFO_UPDATE_FAIL="1202"
)

ApiErrorCodeEnumV2 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1302100,
    USER_NOT_EXISTS=1302101,
    USER_INFO_UPDATE_FAIL=1302102
)

LanguageEnum = enum(
    ZH_CN='zh-cn',
    EN='en'
)

LANGUAGE_CHOICES = [
    (LanguageEnum.ZH_CN, _(u"中文")),
    (LanguageEnum.EN, _(u"英文"))
]

TIME_ZONE_LIST = pytz.common_timezones

TIME_ZONE_CHOICES = [(i, i) for i in TIME_ZONE_LIST]


# note: Add synchronization when add login api
LOGIN_API_URL_SUFFIX_LIST = [
    'is_login',
    'get_user',
    'get_all_user',
    'get_batch_user',
]
