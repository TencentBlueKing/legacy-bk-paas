# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from enum import Enum


class AppStateEnum(Enum):
    OFFLINE = 0
    DEVELOPMENT = 1
    TEST = 3
    ONLINE = 4
    IN_TEST = 8
    IN_ONLINE = 9
    IN_OFFLINE = 10


# 应用状态信息
STATE_CHOICES = [
    (AppStateEnum.OFFLINE.value, "已下架"),
    (AppStateEnum.DEVELOPMENT.value, "开发中"),
    (AppStateEnum.TEST.value, "测试中"),
    (AppStateEnum.ONLINE.value, "已上线"),
    (AppStateEnum.IN_TEST.value, "正在提测"),
    (AppStateEnum.IN_ONLINE.value, "正在上线"),
    (AppStateEnum.IN_OFFLINE.value, "正在下架"),
]
STATE_CHOICES_DISPALY_DICT = dict(STATE_CHOICES)


# App允许打开条件: ALL全部/TEST 只有测试/PRO只有正式/NONE不能打开
class AppOpenEnum(Enum):
    OPEN_IN_ALL = 1
    OPEN_IN_TEST = 2
    OPEN_IN_PROD = 3
    OPEN_NONE = 4


class LanguageEnum(Enum):
    PYTHON = "python"
    PHP = "php"


LANGUAGE_CHOICES = [
    (LanguageEnum.PYTHON.value, 'Python'),
    (LanguageEnum.PHP.value, 'PHP'),
]


class VCSTypeEnum(Enum):
    GIT = 0
    SVN = 1


VCS_TYPE_CHOICES = [
    (VCSTypeEnum.GIT.value, u'Git'),
    (VCSTypeEnum.SVN.value, u'SVN'),
]
VCS_TYPE_VALID_VALUES = dict(VCS_TYPE_CHOICES).keys()


class DBTypeEnum(Enum):
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    ORACLE = "oracle"
    DB2 = "db2"
    SQLSERVER = "sqlserver"


DB_TYPE_CHOICES = [
    (DBTypeEnum.MYSQL.value, 'MySQL',),
    (DBTypeEnum.POSTGRESQL.value, 'PostgreSQL'),
    (DBTypeEnum.ORACLE.value, 'Oracle'),
    (DBTypeEnum.DB2.value, 'DB2'),
    (DBTypeEnum.SQLSERVER.value, 'SQL Server'),
]
DB_TYPE_VALID_VALUES = dict(DB_TYPE_CHOICES).keys()
