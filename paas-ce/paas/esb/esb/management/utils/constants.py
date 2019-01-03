# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


FUNCTION_CONTROLLERS = [
    {
        'func_code': 'user_auth::skip_user_auth',
        'func_name': 'Whether to skip user authentication',
        'wlist': 'bk_paas_log_alert,bk_cdman,bk_fta_solutions,fta_solutions,gcloud,bk_monitor',
    }
]


SYSTEM_DOC_CATEGORY = [
    {
        'name': 'default',
        'label': u'默认分类',
        'priority': 1,
        'systems': []
    },
    {
        'name': 'user_base_service',
        'label': u'基础用户服务',
        'priority': 10,
        'systems': ['BK_LOGIN', 'BK_PAAS', 'CMSI']
    },
    {
        'name': 'config_service',
        'label': u'配置管理',
        'priority': 20,
        'systems': ['CC']
    },
    {
        'name': 'host_management',
        'label': u'主机管控',
        'priority': 30,
        'systems': ['JOB', 'GSE']
    },
    {
        'name': 'management_tools',
        'label': u'管理工具',
        'priority': 50,
        'systems': ['SOPS', 'MONITOR']
    },
]
