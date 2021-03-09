# -*- coding: utf-8 -*-
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
