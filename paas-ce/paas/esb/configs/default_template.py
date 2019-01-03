# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""项目 settings 配置模板
"""

# Generic Django project settings
DEBUG = False

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

# esb app_token
ESB_TOKEN = '41f076b7-afce-46eb-9e85-dab245eb0931'

# Third party system host

# paas host
PAAS_HOST = 'http://127.0.0.1:8003'

# host for bk login
HOST_BK_LOGIN = 'http://127.0.0.1:8003'

# host for bk paas
BK_PAAS_HOST = 'http://127.0.0.1:8003'

# host for cc
HOST_CC = ''

# host for cc v3
HOST_CC_V3 = ''

# host for fta
HOST_FTA = ''

# Redis config
USE_SENTINEL = False
REDIS_HOST = ''
REDIS_PORT = 6379
REDIS_PASSWORD = ''
REDIS_MASTER_NAME = ''
