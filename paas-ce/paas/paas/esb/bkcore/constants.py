# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.utils.translation import ugettext as _


SYSTEMS = [
    {
        'name': 'BK_LOGIN',
        'label': _(u'蓝鲸登录平台'),
    },
    {
        'name': 'CC',
        'label': _(u'蓝鲸配置平台'),
    },
    {
        'name': 'GSE',
        'label': _(u'蓝鲸管控平台'),
    },
    {
        'name': 'JOB',
        'label': _(u'蓝鲸作业平台'),
    },
    {
        'name': 'CMSI',
        'label': _(u'蓝鲸消息管理'),
    },
    {
        'name': 'SOPS',
        'label': _(u'标准运维'),
    },
]


SYSTEM_CHANNELS = {
    'CC': [],
    'JOB': [],
    'GSE': [],
    'BK_LOGIN': [],
    'CMSI': [],
    'SOPS': [],
}


FUNCTION_CONTROLLERS = [
    {
        'func_code': 'user_auth::skip_user_auth',
        'func_name': _(u'是否跳过用户身份验证'),
        'wlist': 'bk_paas_log_alert',
    }
]


DEFAULT_DOC_CATEGORY = _(u'默认分类')
