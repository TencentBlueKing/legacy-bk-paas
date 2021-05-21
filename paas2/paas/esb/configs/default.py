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

import environ
from django.conf import settings
from django.utils.translation import pgettext, ugettext

env = environ.Env()


BK_APIGW_URL = env.str("BK_APIGW_URL", "")
APIGATEWAY_ENABLED = bool(BK_APIGW_URL)
BK_ESB_MENU_ITEM_BUFFET_HIDDEN = env.bool("BK_ESB_MENU_ITEM_BUFFET_HIDDEN", False)


menu_items = [
    {"name": "manager_index", "label": pgettext("menu", u"简介"), "path": "manager.index"},
    {
        "name": "system_manager",
        "label": pgettext("menu", u"系统管理"),
        "path": "manager.system.list",
    },
    {
        "name": "channel_manager",
        "label": pgettext("menu", u"通道管理"),
        "path": "manager.channel.list",
    },
]

if not BK_ESB_MENU_ITEM_BUFFET_HIDDEN:
    menu_items += [
        {
            "name": "buffet_manager",
            "label": pgettext("menu", u"自助接入"),
            "path": "manager.buffet_comp.list",
        },
    ]

if settings.EDITION == "ee":
    menu_items += [
        {
            "name": "status_index",
            "label": pgettext("menu", u"运行数据"),
            "path": "status.index",
        },
    ]


menu_items += [
    {
        "name": "api_docs",
        "label": pgettext("menu", u"组件API文档" if APIGATEWAY_ENABLED else u"API文档"),
        "path": "esb_api_docs",
    },
]


BK_SYSTEMS = {
    "BK_LOGIN": {
        "name": "BK_LOGIN",
        "label": ugettext(u"蓝鲸统一登录"),
        "remark": ugettext(u"蓝鲸统一登录，管理用户登录验证，及用户信息"),
    },
    "BK_PAAS": {
        "name": "BK_PAAS",
        "label": ugettext(u"蓝鲸开发者中心"),
        "remark": ugettext(u"蓝鲸开发者中心"),
    },
    "CC": {
        "name": "CC",
        "label": ugettext(u"蓝鲸配置平台"),
        "remark": ugettext(u"蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。"),
    },
    "GSE": {
        "name": "GSE",
        "label": ugettext(u"蓝鲸管控平台"),
        "remark": ugettext(u"蓝鲸管控平台"),
    },
    "JOB": {
        "name": "JOB",
        "label": ugettext(u"蓝鲸作业平台(不推荐)"),
        "remark": ugettext(
            u"作业平台（Job）是一套基于蓝鲸智云管控平台Agent管道之上的基础操作平台，具备大并发处理能力；除了支持脚本执行、文件拉取/分发、定时任务等一系列可实现的基础运维场景以外，还运用流程化的理念很好的将零碎的单个任务组装成一个作业流程；而每个任务都可做为一个原子节点，提供给其它系统和平台调度，实现调度自动化。"  # noqa
        ),
    },
    "JOBV3": {
        "name": "JOBV3",
        "label": ugettext(u"蓝鲸作业平台V3"),
        "remark": ugettext(
            u"作业平台（Job）是一套基于蓝鲸智云管控平台Agent管道之上的基础操作平台，具备大并发处理能力；除了支持脚本执行、文件拉取/分发、定时任务等一系列可实现的基础运维场景以外，还运用流程化的理念很好的将零碎的单个任务组装成一个作业流程；而每个任务都可做为一个原子节点，提供给其它系统和平台调度，实现调度自动化。"  # noqa
        ),
    },
    "CMSI": {
        "name": "CMSI",
        "label": ugettext(u"蓝鲸消息管理"),
        "remark": ugettext(u"蓝鲸消息管理，用于支持向用户发送多种类型的消息，包括邮件、短信、语音通知等"),
    },
    "SOPS": {
        "name": "SOPS",
        "label": ugettext(u"标准运维"),
        "remark": ugettext(u"标准运维"),
    },
    "MONITOR": {
        "name": "MONITOR",
        "label": ugettext(u"监控平台"),
        "remark": ugettext(u"监控平台"),
    },
    "MONITOR_V3": {
        "name": "MONITOR_V3",
        "label": ugettext(u"监控平台V3"),
        "remark": ugettext(u"监控平台V3"),
    },
    "USERMANAGE": {
        "name": "USERMANAGE",
        "label": ugettext(u"用户管理"),
        "remark": ugettext(u"用户管理"),
    },
    "ESB": {
        "name": "ESB",
        "label": ugettext(u"API网关"),
        "remark": ugettext(u"API网关"),
    },
    "ITSM": {
        "name": "ITSM",
        "label": ugettext(u"流程服务"),
        "remark": ugettext(u"流程服务"),
    },
    "LOG_SEARCH": {
        "name": "LOG_SEARCH",
        "label": ugettext(u"日志平台"),
        "remark": ugettext(u"日志平台"),
    },
    "IAM": {
        "name": "IAM",
        "label": ugettext(u"权限中心"),
        "remark": ugettext(u"权限中心"),
    },
    "BK_DOCS_CENTER": {
        "name": "BK_DOCS_CENTER",
        "label": ugettext(u"文档中心"),
        "remark": ugettext(u"文档中心"),
    },
    "DATA": {
        "name": "DATA",
        "label": ugettext(u"数据平台"),
        "remark": ugettext(u"数据平台"),
    },
    "BSCP": {
        "name": "BSCP",
        "label": ugettext(u"蓝鲸基础服务配置平台"),
        "remark": ugettext(u"蓝鲸基础服务配置平台"),
    },
}


SYSTEM_DOC_CATEGORY = {
    u"默认分类": {
        "name": "default",
        "label": pgettext("doccategory", u"默认分类"),
    },
    u"基础用户服务": {
        "name": "user_base_service",
        "label": pgettext("doccategory", u"基础用户服务"),
    },
    u"配置管理": {
        "name": "config_service",
        "label": pgettext("doccategory", u"配置管理"),
    },
    u"主机管控": {
        "name": "host_management",
        "label": pgettext("doccategory", u"主机管控"),
    },
    u"管理工具": {
        "name": "management_tools",
        "label": pgettext("doccategory", u"管理工具"),
    },
}
