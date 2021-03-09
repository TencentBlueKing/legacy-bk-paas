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

# domain
PAAS_DOMAIN = "dev.paas.open.bking.com:8000"
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = ""
HTTP_SCHEMA = "http"

# cookie访问域
BK_COOKIE_DOMAIN = ".bking.com"

# ESB Token
ESB_TOKEN = ""

# 用户管理内部接口地址
BK_USERMGR_HOST = ""
