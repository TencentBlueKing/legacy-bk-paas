# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from django.utils.translation import ugettext as _

from common.constants import enum


# 提测和上线分类
OperateIDEnum = enum(
    TO_TEST=0,
    TO_ONLINE=1,
    TO_OUTLINE=2,
    IN_TEST=3,
    IN_ONLINE=4,
    IN_OUTLINE=5,
    REGISTER_INFO=6,
    CREATE_DB=7,
    INITIAL_CVS=8,
    GRANT_DB_AUTH=9,
    INITIAL_APP_CODE=10,
    DELETE_APP=11,
)

OPERATE_ID_CHOICES = [
    (OperateIDEnum.TO_TEST, _(u"提测")),
    (OperateIDEnum.TO_ONLINE, _(u"上线")),
    (OperateIDEnum.TO_OUTLINE, _(u"下架")),
    (OperateIDEnum.IN_TEST, _(u"正在提测")),
    (OperateIDEnum.IN_ONLINE, _(u"正在上线")),
    (OperateIDEnum.IN_OUTLINE, _(u"正在下架")),
    (OperateIDEnum.REGISTER_INFO, _(u"基本信息注册")),
    (OperateIDEnum.CREATE_DB, _(u"数据库创建")),
    (OperateIDEnum.INITIAL_CVS, _(u"SVN代码初始化")),
    (OperateIDEnum.GRANT_DB_AUTH, _(u"数据库授权")),
    (OperateIDEnum.INITIAL_APP_CODE, _(u"初始化APP代码")),
    (OperateIDEnum.DELETE_APP, _(u"删除APP")),
]


OPERATE_CODE_TO_ID_DICT = {
    "0": [
        OperateIDEnum.TO_TEST,
        OperateIDEnum.TO_ONLINE,
        OperateIDEnum.TO_OUTLINE,
        OperateIDEnum.IN_TEST,
        OperateIDEnum.IN_ONLINE,
        OperateIDEnum.IN_OUTLINE,
    ],
    "1": [OperateIDEnum.TO_TEST, OperateIDEnum.IN_TEST],
    "2": [OperateIDEnum.TO_ONLINE, OperateIDEnum.IN_ONLINE],
    "3": [OperateIDEnum.TO_OUTLINE, OperateIDEnum.IN_OUTLINE],
}


StatusEnum = enum(
    SUCCESS=True,
    FAIL=False,
)

# 用户操作类型
UserOperateTypeEnum = enum(
    APP_CREATE=1,
    APP_DELETE=2,
    RELEASE_TEST=3,
    RELEASE_ONLINE=4,
    RELEASE_OUTLINE=5,
)

USER_OPERATE_TYPE_CHOICES = [
    (UserOperateTypeEnum.APP_CREATE, _(u"APP创建")),
    (UserOperateTypeEnum.APP_DELETE, _(u"删除APP")),
    (UserOperateTypeEnum.RELEASE_TEST, _(u"APP提测")),
    (UserOperateTypeEnum.RELEASE_ONLINE, _(u"APP上线")),
    (UserOperateTypeEnum.RELEASE_OUTLINE, _(u"APP下架")),
]


# app engine event状态
EventStatusEnum = enum(
    READY="READY",
    PENDING="PENDING",
    FAILURE="FAILURE",
    SUCCESS="SUCCESS",
)

EventResultEnum = enum(
    FAIL=0,
    SUCCESS=1,
    PENDING=2,
)


# 部署校验时的错误
DEPLOY_ERROR_DICT = {
    "20000": _(u"激活码错误, 请确认激活码申请时app_code填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新"),
    "20001": _(u"app_code和激活码不匹配! 请确认激活码申请时app_code填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新"),
    "20002": _(u"部署环境对应机器的mac地址与激活码不匹配! 请确认激活码申请时所有agent机器的mac地址填写正确, 可重新申请然后在[应用管理-基本信息]中编辑更新"),
    "20100": _(u"PaaS Agent 服务器 ID 或者 TOKEN 不正确! 请确认[开发者中心-服务器信息]中注册的Agent服务器 ID 及 TOKEN与实际Agent部署配置一致"),
    "20101": _(u"PaaS Agent License 有效性过期"),
    "20102": _(u"PaaS Agent License mac地址有误"),
    "20103": _(u"PaaS Agent License 解析失败"),
    "20104": _(u"PaaS Agent License 证书文件不存在"),
    "20200": _(u"分配服务器失败"),
    "20210": _(u"分发任务到PaaSAgent失败"),
    "20300": _(u"第三方服务 RabbitMQ 申请资源失败, 请确认[开发者中心-第三方服务]中注册的 RabbitMQ 可用"),
}
