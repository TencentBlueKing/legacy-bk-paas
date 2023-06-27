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

"""
测试环境配置
"""

# 数据库配置信息
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "open_paas_unittest",
    }
}

# cookie访问域
BK_COOKIE_DOMAIN = ".bking.com"
BK_DOMAIN = "bking.com"

# domain
PAAS_DOMAIN = "openpaas.o.bking.com"
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = ""
HTTP_SCHEMA = "http"

# cookie访问域
BK_COOKIE_DOMAIN = ""

HOST_IAM = "iam.service.consul"

HOST_IAM_NEW = ""

BK_USERMGR_HOST = ""

# App Engine 地址
ENGINE_HOST = "http://127.0.0.1:8000"

# ESB Token
ESB_TOKEN = ""


# 日志查询Elasticsearch服务器
ELASTICSEARCH_URLS = "127.0.0.1:8080"
ELASTICSEARCH_HOSTS = ELASTICSEARCH_URLS.split(";")


# 告警配置redis配置
ALARM_REDIS_HOST = "127.0.0.1"
ALARM_REDIS_PORT = 6379
ALARM_REDIS_CHANNEL = "paas_app_alarm_config"

# 登录域名
LOGIN_DOMAIN = "paas.open.bking.com"

# 对象存储服务配置
STORAGE_TYPE = "none"
STORAGE_HOST = ""
STORAGE_PORT = 80
STORAGE_ACCESS_KEY = ""
STORAGE_SECRET_KEY = ""
STORAGE_ADMIN_ENDPOINT = "/admin/"
STORAGE_TENANT = ""
