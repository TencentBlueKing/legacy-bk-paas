# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.utils.translation import pgettext, ugettext


menu_items = [
    {
        'name': 'manager_index',
        'label': pgettext('menu', u'简介'),
        'path': 'manager.index'
    },
    {
        'name': 'system_manager',
        'label': pgettext('menu', u'系统管理'),
        'path': 'manager.system.list',
    },
    {
        'name': 'channel_manager',
        'label': pgettext('menu', u'通道管理'),
        'path': 'manager.channel.list',
    },
    {
        'name': 'buffet_manager',
        'label': pgettext('menu', u'自助接入'),
        'path': 'manager.buffet_comp.list',
    },
    # {
    #     'name': 'status_index',
    #     'label': pgettext('menu', u'运行数据'),
    #     'path': 'status.index',
    # },
    {
        'name': 'user_guide',
        'label': pgettext('menu', u'使用指南'),
        'path': 'guide.page.index',
    },
    {
        'name': 'api_docs',
        'label': pgettext('menu', u'API文档'),
        'path': 'esb_api_docs',
    },
    # {
    #     'name': 'esb_doc',
    #     'label': pgettext('menu', u'ESB文档'),
    #     'path': '/doc/index.html',
    #     'is_real_url': True,
    # },
]


BK_SYSTEMS = {
    'BK_LOGIN': {
        'name': 'BK_LOGIN',
        'label': ugettext(u'蓝鲸登录平台'),
        'remark': ugettext(u'蓝鲸登录平台，管理用户登录验证，及用户信息'),
    },
    'BK_PAAS': {
        'name': 'BK_PAAS',
        'label': ugettext(u'蓝鲸开发者中心'),
        'remark': ugettext(u'蓝鲸开发者中心'),
    },
    'CC': {
        'name': 'CC',
        'label': ugettext(u'蓝鲸配置平台'),
        'remark': ugettext(u'蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。'),
    },
    'GSE': {
        'name': 'GSE',
        'label': ugettext(u'蓝鲸管控平台'),
        'remark': ugettext(u'蓝鲸管控平台'),
    },
    'JOB': {
        'name': 'JOB',
        'label': ugettext(u'蓝鲸作业平台'),
        'remark': ugettext(u'作业平台（Job）是一套基于蓝鲸智云管控平台Agent管道之上的基础操作平台，具备大并发处理能力；除了支持脚本执行、文件拉取/分发、定时任务等一系列可实现的基础运维场景以外，还运用流程化的理念很好的将零碎的单个任务组装成一个作业流程；而每个任务都可做为一个原子节点，提供给其它系统和平台调度，实现调度自动化。'),  # noqa
    },
    'CMSI': {
        'name': 'CMSI',
        'label': ugettext(u'蓝鲸消息管理'),
        'remark': ugettext(u'蓝鲸消息管理，用于支持向用户发送多种类型的消息，包括邮件、短信、语音通知等'),
    },
    'SOPS': {
        'name': 'SOPS',
        'label': ugettext(u'标准运维'),
        'remark': ugettext(u'标准运维'),
    },
}


SYSTEM_DOC_CATEGORY = {
    u'默认分类': {
        'name': 'default',
        'label': pgettext('doccategory', u'默认分类'),
        'priority': 1,
        'systems': []
    },
    u'基础用户服务': {
        'name': 'user_base_service',
        'label': pgettext('doccategory', u'基础用户服务'),
        'priority': 10,
        'systems': ['BK_LOGIN', 'BK_PAAS', 'CMSI']
    },
    u'配置管理': {
        'name': 'config_service',
        'label': pgettext('doccategory', u'配置管理'),
        'priority': 20,
        'systems': ['CC']
    },
    u'主机管控': {
        'name': 'host_management',
        'label': pgettext('doccategory', u'主机管控'),
        'priority': 30,
        'systems': ['JOB', 'GSE']
    },
    u'管理工具': {
        'name': 'management_tools',
        'label': pgettext('doccategory', u'管理工具'),
        'priority': 50,
        'systems': ['SOPS']
    },
}
