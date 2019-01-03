# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
DEBUG = False

# use the static root 'static' in production envs
if not DEBUG:
    STATIC_ROOT = 'static'

# 数据库配置信息
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',   # 默认用mysql
        'NAME': 'open_paas',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

# 初始化用户名、密码
USERNAME = 'admin'
PASSWORD = 'admin'

PAAS_DOMAIN = 'bking.com'
PAAS_INNER_DOMAIN = 'bking.com'
HTTP_SCHEMA = 'http'

# cookie访问域
BK_COOKIE_DOMAIN = '.bking.com'

SECRET_KEY = 'XEz7VLlQNdIq9iFl1t6LtWobQEcG4ayoPa2esHwatkHZxiuDf0'

# ESB Token
ESB_TOKEN = '41f076b7-afce-46eb-9e85-dab245eb0931'
