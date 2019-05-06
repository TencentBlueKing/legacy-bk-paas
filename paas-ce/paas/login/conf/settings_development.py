# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

开发环境配置
""" # noqa

DEBUG = True

# use the static root 'static' in production envs
if not DEBUG:
    STATIC_ROOT = 'static'

# 本地开发登录页面静态资源, 注意: 生产环境使用nginx反向代理需要改成 SITE_URL = "/login/"
SITE_URL = "/"

STATIC_URL = "/static/"

# 数据库配置信息
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',   # 默认用mysql
        'NAME': 'open_paas',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

# 初始化用户名、密码
USERNAME = 'admin'
PASSWORD = 'admin'

# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = ''
HTTP_SCHEMA = 'http'


# cookie访问域
BK_COOKIE_DOMAIN = '.bking.com'

SECRET_KEY = 'jO149njrTj4kEx6ZbUH8Zc53bfQJctINWaEzTWIsOoxSDNwK2I'

# ESB Token
ESB_TOKEN = '41f076b7-afce-46eb-9e85-dab245eb0931'
