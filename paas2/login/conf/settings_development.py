# -*- coding: utf-8 -*-
"""
开发环境配置
"""

DEBUG = True

# use the static root 'static' in production envs
if not DEBUG:
    STATIC_ROOT = "static"

SITE_URL = "/"

# 数据库配置信息
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",  # 默认用mysql
        "NAME": "open_paas",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    }
}

# domain
PAAS_DOMAIN = "dev.paas.open.bking.com:8000"
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = ""
HTTP_SCHEMA = "http"

# cookie访问域
BK_COOKIE_DOMAIN = ".bking.com"

# 初始化用户名、密码
USERNAME = "admin"
PASSWORD = "admin"

# 用户管理内部接口地址
BK_USERMGR_HOST = ""

# ESB Token
ESB_TOKEN = ""

CERTIFICATE_DIR = "/"
CERTIFICATE_SERVER_DOMAIN = "127.0.0.1"
