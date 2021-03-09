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
开发环境配置
"""

DEBUG = True

# use the static root 'static' in production envs
if not DEBUG:
    STATIC_ROOT = "static"


# 数据库配置信息
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",  # 默认用mysql
        "NAME": "open_paas",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    },
    "bksuite": {
        "ENGINE": "django.db.backends.mysql",  # 默认用mysql
        "NAME": "bksuite_common",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    },
}

# domain
PAAS_DOMAIN = "dev.paas.open.bking.com:8000"
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = ""
HTTP_SCHEMA = "http"


# cookie 名称
BK_COOKIE_NAME = "bk_token"
# cookie有效期
BK_COOKIE_AGE = 60 * 60 * 24
# cookie访问域
BK_COOKIE_DOMAIN = ".bking.com"

# 控制台地址
ENGINE_HOST = "http://127.0.0.1:8000"
# 登陆服务地址
LOGIN_HOST = "http://paas.open.bking.com"


# host for cc
HOST_CC = "__CMDB_FQDN__:__DEFAULT_HTTP_PORT__"
# host for job
HOST_JOB = "__JOB_FQDN__:__DEFAULT_HTTP_PORT__"
# host for gse
HOST_GSE = "__GSE_HOST__:__GSEAPISERVER_PORT__"
# host for DATA，数据平台监控告警系统
HOST_DATA = "__DATAAPI_HOST__:__DATAAPI_PORT__"
# host for fta
HOST_FTA = "__FTA_HOST__:__FTA_API_PORT__"
# host iam, should use the inner ip and port
HOST_IAM = "__IAM_HOST__:__IAM_PORT__"
HOST_IAM_NEW = "__BKIAM_HOST__:__BKIAM_PORT__"

# SECRET_KEY = ''

# ESB Token
ESB_TOKEN = ""

# app env for deploy
APP_DEPLOY_ENVS = {
    # iam v2
    # "BK_IAM_HOST": bk_iam_inner_host,
    "BK_IAM_INNER_HOST": "%s://%s" % ("http", HOST_IAM),
    # iam v3
    "BK_IAM_V3_APP_CODE": "bk_iam",
    "BK_IAM_V3_INNER_HOST": "%s://%s" % ("http", HOST_IAM_NEW),
}

# 日志查询Elasticsearch服务器
ELASTICSEARCH_URLS = "log.o.bking.com:80"
ELASTICSEARCH_HOSTS = ELASTICSEARCH_URLS.split(";")


# 告警配置redis配置, in productio, use sentinel
USE_SENTINEL = False
ALARM_REDIS_HOST = "127.0.0.1"
ALARM_REDIS_PORT = 6379
ALARM_REDIS_MASTER_NAME = "__REDIS_MASTER_NAME__"
ALARM_REDIS_PASSWORD = ""
ALARM_REDIS_CHANNEL = "paas_app_alarm_config"


# 登录域名
LOGIN_DOMAIN = "paas.open.bking.com"
