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
from enum import Enum


# app code的正则常量(由小写英文字母、连接符(-)或数字组成  注意, 不再支持下划线
APP_CODE_REGEX = '[a-z0-9-]+'
# SaaS app code的正则常量(由小写英文字母、下划线、连接符(-)或数字组成
SAAS_CODE_REGEX = '[a-z0-9_-]+'

APP_CODE_CHECK_REGEX = r'^[a-z][a-z0-9-]{1,15}$'
APP_CODE_CHECK_PATTERN = re.compile(APP_CODE_CHECK_REGEX)
APP_CODE_CHECK_MSG = "只允许输入小写英文字母,连字符或数字,并且以字母开头"

GIT_URL_CHECK_PATTERN = re.compile(r'^(http[s]{0,1}|git)://', re.IGNORECASE)
SVN_URL_CHENK_PATTREN = re.compile(r'^(http[s]{0,1}|svn)://', re.IGNORECASE)


# 用户角色
class RoleCodeEnum(Enum):
    # 普通用户
    STAFF = 0
    # 超级管理员
    SUPERUSER = 1
    # 开发者
    DEVELOPER = 2
    # OPERATOR = 3


# ROLECODE_CHOICES = [
#     (RoleCodeEnum.STAFF.value, "普通用户"),
#     (RoleCodeEnum.SUPERUSER.value, "超级管理员"),
#     (RoleCodeEnum.DEVELOPER.value, "开发者"),
#     # (RoleCodeEnum.OPERATOR.value, "职能化用户")
# ]

# ROLECODE_LIST = [
#     RoleCodeEnum.STAFF.value,
#     RoleCodeEnum.SUPERUSER.value,
#     RoleCodeEnum.DEVELOPER.value,
#     # RoleCodeEnum.OPERATOR.value
# ]


class LogoImgRelatedDirEnum(Enum):
    APP = "applogo"
    ICON = "iconlogo"
    # saas内置应用logo解压目录
    SAAS = "saaslogo"


class ConsoleErrorCodes(Enum):
    E1303000_DEFAULT_CODE = 1303000
    E1303001_BASE_SETTINGS_ERROR = 1303001
    E1303002_BASE_DATABASE_ERROR = 1303002
    E1303003_BASE_HTTP_DEPENDENCE_ERROR = 1303003
    E1303004_BASE_BKSUITE_DATABASE_ERROR = 1303004
    E1303005_BASE_LICENSE_ERROR = 1303005

    # 加载桌面应用错误
    E1303100_DESKTOP_USER_APP_LOAD_ERROR = 1303100
    # 应用市场查询应用失败
    E1303101_MARKET_APP_QUERY_FAIL = 1303101
    # 应用市场应用详情查询失败
    E1303102_MARKET_APP_DETAIL_QUERY_FAIL = 1303102

    # 请求微信GET接口出错
    E1303200_WEIXIN_HTTP_GET_REQUEST_ERROR = 1303200
    # 请求微信POST接口出错
    E1303201_WEIXIN_HTTP_POST_REQUEST_ERROR = 1303201
    # 微信公众号推送事件响应出错
    E1303202_WEIXIN_MP_EVENT_PUSH_RESPONSE_ERROR = 1303202


class PermissionErrorEnum(Enum):
    APP_NOT_EXISTS = 1
    NOT_APP_DEVELOPER = 2
    SAAS_NOT_EXISTS = 3
    NOT_SUPERUSER = 4


class ModeEnum(Enum):
    ALL = "all"
    TEST = "test"
    PROD = "prod"


ModeNameDict = {
    ModeEnum.ALL.value: "全部",
    ModeEnum.TEST.value: "测试",
    ModeEnum.PROD.value: "正式",
}
