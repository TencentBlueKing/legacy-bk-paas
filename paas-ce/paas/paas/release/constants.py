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


# 提测和上线分类
class OperateIDEnum(Enum):
    TO_TEST = 0
    TO_ONLINE = 1
    TO_OFFLINE = 2
    IN_TEST = 3
    IN_ONLINE = 4
    IN_OFFLINE = 5
    REGISTER_INFO = 6
    CREATE_DB = 7
    INITIAL_CVS = 8
    GRANT_DB_AUTH = 9
    INITIAL_APP_CODE = 10
    DELETE_APP = 11


OPERATE_ID_CHOICES = [
    (OperateIDEnum.TO_TEST.value, "提测"),
    (OperateIDEnum.TO_ONLINE.value, "上线"),
    (OperateIDEnum.TO_OFFLINE.value, "下架"),
    (OperateIDEnum.IN_TEST.value, "正在提测"),
    (OperateIDEnum.IN_ONLINE.value, "正在上线"),
    (OperateIDEnum.IN_OFFLINE.value, "正在下架"),

    (OperateIDEnum.REGISTER_INFO.value, "基本信息注册"),
    (OperateIDEnum.CREATE_DB.value, "数据库创建"),
    (OperateIDEnum.INITIAL_CVS.value, "SVN代码初始化"),
    (OperateIDEnum.GRANT_DB_AUTH.value, "数据库授权"),
    (OperateIDEnum.INITIAL_APP_CODE.value, "初始化APP代码"),
    (OperateIDEnum.DELETE_APP.value, "删除APP"),
]

APP_ALL_OPERATE_ID_LIST = [OperateIDEnum.TO_TEST.value,
                           OperateIDEnum.TO_ONLINE.value,
                           OperateIDEnum.TO_OFFLINE.value,
                           OperateIDEnum.IN_TEST.value,
                           OperateIDEnum.IN_ONLINE.value,
                           OperateIDEnum.IN_OFFLINE.value]
APP_TEST_OPERATE_ID_LIST = [OperateIDEnum.TO_TEST.value, OperateIDEnum.IN_TEST.value]
APP_ONLINE_OPERATE_ID_LIST = [OperateIDEnum.TO_ONLINE.value, OperateIDEnum.IN_ONLINE.value]
APP_OFFLINE_OPERATE_ID_LIST = [OperateIDEnum.TO_OFFLINE.value, OperateIDEnum.IN_OFFLINE.value]

APP_DID_OPERATE_ID_LIST = [OperateIDEnum.TO_TEST.value,
                           OperateIDEnum.TO_ONLINE.value,
                           OperateIDEnum.TO_OFFLINE.value]

APP_ONGOING_OPERATE_ID_LIST = [OperateIDEnum.IN_TEST.value,
                               OperateIDEnum.IN_ONLINE.value,
                               OperateIDEnum.IN_OFFLINE.value]


class StatusEnum(Enum):
    SUCCESS = True
    FAIL = False


# 用户操作类型
class UserOperateTypeEnum(Enum):
    APP_CREATE = 1
    APP_DELETE = 2
    RELEASE_TEST = 3
    RELEASE_ONLINE = 4
    RELEASE_OFFLINE = 5


USER_OPERATE_TYPE_CHOICES = [
    (UserOperateTypeEnum.APP_CREATE.value, "APP创建"),
    (UserOperateTypeEnum.APP_DELETE.value, "删除APP"),
    (UserOperateTypeEnum.RELEASE_TEST.value, "APP提测"),
    (UserOperateTypeEnum.RELEASE_ONLINE.value, "APP上线"),
    (UserOperateTypeEnum.RELEASE_OFFLINE.value, "APP下架"),
]


# app engine event状态
class EventStatusEnum(Enum):
    READY = "READY"
    PENDING = "PENDING"
    FAILURE = "FAILURE"
    SUCCESS = "SUCCESS"


class OperateCodeEnum(Enum):
    """
    发布记录类型
    """
    ALL = "0"
    TEST = "1"
    ONLINE = "2"
    OFFLINE = "3"


OPERATE_CODE_LIST = [
    OperateCodeEnum.ALL.value,
    OperateCodeEnum.TEST.value,
    OperateCodeEnum.ONLINE.value,
    OperateCodeEnum.OFFLINE.value
]


class EventResultEnum(Enum):
    FAIL = 0
    SUCCESS = 1
    PENDING = 2


class DeployPageTypeEnum(Enum):
    TEST = "test_form"
    ONLINE = "online_form"
    OFFLINE = "offline_form"


# 部署校验时的错误
DEPLOY_ERROR_DICT = {
    "20000": "激活码错误, 请确认激活码申请时app_code填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新",
    "20001": "app_code和激活码不匹配! 请确认激活码申请时app_code填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新",
    "20002": "部署环境对应机器的mac地址与激活码不匹配! 请确认激活码申请时所有agent机器的mac地址填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新",
    "20100": "PaaS Agent 服务器 ID 或者 TOKEN 不正确! 请确认[开发者中心-服务器信息]中注册的Agent服务器 ID 及 TOKEN与实际Agent部署配置一致",
    "20101": "PaaS Agent License 有效性过期",
    "20102": "PaaS Agent License mac地址有误",
    "20103": "PaaS Agent License 解析失败",
    "20104": "PaaS Agent License 证书文件不存在",
    "20300": "第三方服务 RabbitMQ 申请资源失败, 请确认 RabbitMQ 可用",
}
