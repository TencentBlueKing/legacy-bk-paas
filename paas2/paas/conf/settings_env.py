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

env = environ.Env()

# Write the developing config into .env file please.
env.read_env(env.str("ENV_FILE", ".env"))

# Generic Django project settings
DEBUG = env.bool("DEBUG", False)

# use the static root 'static' in production envs
if not DEBUG:
    STATIC_ROOT = "static"

# 数据库配置信息
DATABASES = {
    "default": {
        "ENGINE": env.str("BK_PAAS_DATABASE_ENGINE", "django.db.backends.mysql"),
        "NAME": env.str("BK_PAAS_DATABASE_NAME", "open_paas"),
        "USER": env.str("BK_PAAS_DATABASE_USER"),
        "PASSWORD": env.str("BK_PAAS_DATABASE_PASSWORD"),
        "HOST": env.str("BK_PAAS_DATABASE_HOST", ""),
        "PORT": env.int("BK_PAAS_DATABASE_PORT"),
    },
    "bksuite": {
        "ENGINE": env.str("BK_PAAS_DATABASE_ENGINE", "django.db.backends.mysql"),
        "NAME": env.str("BK_PAAS_DATABASE_NAME_BKSUITE_COMMON", "bksuite_common"),
        "USER": env.str("BK_PAAS_DATABASE_USER"),
        "PASSWORD": env.str("BK_PAAS_DATABASE_PASSWORD"),
        "HOST": env.str("BK_PAAS_DATABASE_HOST", ""),
        "PORT": env.int("BK_PAAS_DATABASE_PORT"),
    },
}

# secure
SECRET_KEY = env.str("BK_PAAS_SECRET_KEY")
# ESB Token
ESB_TOKEN = env.str("BK_PAAS_ESB_TOKEN")

# website
# domain
PAAS_DOMAIN = env.str("BK_PAAS_ADDR")
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = env.str("BK_PAAS_LOCAL_ADDR", "paas.open-paas.svc")
# schema = http/https, default http
HTTP_SCHEMA = env.str("BK_PAAS_HTTP_SCHEMA", "http")

# cookie 名称
BK_COOKIE_NAME = "bk_token"
# cookie有效期
BK_COOKIE_AGE = 60 * 60 * 24
# cookie访问域
BK_COOKIE_DOMAIN = "." + env.str("BK_DOMAIN")


# paas hosts
# app engine
ENGINE_HOST = env.str("BK_PAAS_APPENGINE_LOCAL_URL", "http://appengine.bk-paas.svc")
# 登陆服务地址
LOGIN_HOST = env.str("BK_PAAS_LOGIN_LOCAL_URL", "http://login.bk-paas.svc")
# 用户管理内部接口地址
BK_USERMGR_HOST = env.str("BK_USERMGR_LOCAL_ADDR", "backend.bk-usermgr.svc")
# PaaS3.0 的访问地址
BK_PAAS3_URL = env.str("BK_PAAS3_URL", "")
# API 网关访问地址
BK_APIGW_URL = env.str("BK_APIGW_URL", "")
# API 网关文档中心地址
BK_APIGW_DOC_URL = env.str("BK_APIGW_DOC_URL", "")
# 是否隐藏菜单项：ESB 管理中的自助接入
BK_ESB_MENU_ITEM_BUFFET_HIDDEN = env.bool("BK_ESB_MENU_ITEM_BUFFET_HIDDEN", False)

# third-party hosts
# host for cc
HOST_CC = env.str("BK_CMDB_ADDR", "")
# host for job
HOST_JOB = env.str("BK_JOB_ADDR", "")

# host iam, should use the inner ip and port
HOST_IAM = env.str("BK_IAM_LOCAL_ADDR", "")
HOST_IAM_NEW = env.str("BK_IAM_V3_LOCAL_ADDR", "")


# app env for deploy
APP_DEPLOY_ENVS = {
    # iam v2
    # 2020-01-03 change bk_iam_host to bk_iam_inner_host
    # "BK_IAM_HOST": bk_iam_inner_host,
    "BK_IAM_INNER_HOST": "%s://%s" % ("http", HOST_IAM),
    # iam v3
    "BK_IAM_V3_APP_CODE": "bk_iam",
    "BK_IAM_V3_INNER_HOST": "%s://%s" % ("http", HOST_IAM_NEW),
}

# external config
# 日志查询Elasticsearch服务器
ES_USER = env.str("BK_PAAS_ES_USER", "")
ES_PASSWORD = env.str("BK_PAAS_ES_PASSWORD", "")
ES_HOST = env.str("BK_PAAS_ES_HOST", "")
ES_PORT = env.str("BK_PAAS_ES_PORT", "9200")


ELASTICSEARCH_HOSTS = ["{}:{}@{}:{}".format(ES_USER, ES_PASSWORD, ES_HOST, ES_PORT)]
if not (ES_USER and ES_PASSWORD):
    ELASTICSEARCH_HOSTS = ["{}:{}".format(ES_HOST, ES_PORT)]

# 告警配置redis配置: 注意, paas目前仅告警redis, 牵连到日志, 所以暂时不使用sentinel模式
USE_SENTINEL = False
ALARM_REDIS_HOST = env.str("BK_PAAS_REDIS_HOST")
ALARM_REDIS_PORT = env.int("BK_PAAS_REDIS_PORT")
# ALARM_REDIS_MASTER_NAME = env.str("BK_PAAS_REDIS_MASTER_NAME", "")
ALARM_REDIS_MASTER_NAME = ""
ALARM_REDIS_PASSWORD = env.str("BK_PAAS_REDIS_PASSWORD", "")
ALARM_REDIS_CHANNEL = "paas_app_alarm_config"

# for s3 storage
STORAGE_TYPE = env.str("BK_PAAS_SHARED_STORAGE_TYPE", "none")
STORAGE_HOST = env.str("BK_PAAS_CEPH_HOST", "")
STORAGE_PORT = env.int("BK_PAAS_CEPH_S3_PORT", 80)
STORAGE_ACCESS_KEY = env.str("BK_PAAS_S3_ACCESS_KEY", "")
STORAGE_SECRET_KEY = env.str("BK_PAAS_S3_SECRET_KEY", "")
STORAGE_ADMIN_ENDPOINT = "/admin/"
STORAGE_TENANT = env.str("BK_PAAS_S3_UID", "")
