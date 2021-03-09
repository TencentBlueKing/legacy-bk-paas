# -*- coding: utf-8 -*-
"""
环境配置 - 环境变量读取
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
    }
}

# secure
SECRET_KEY = env.str("BK_PAAS_LOGIN_SECRET_KEY")
# ESB Token
ESB_TOKEN = env.str("BK_PAAS_ESB_TOKEN")

# website
# domain
PAAS_DOMAIN = env.str("BK_PAAS_ADDR")
# inner domain, use consul domain,  for api
PAAS_INNER_DOMAIN = env.str("BK_PAAS_LOCAL_ADDR")
# schema = http/https, default http
HTTP_SCHEMA = env.str("BK_PAAS_HTTP_SCHEMA", "http")

# cookie访问域
BK_COOKIE_DOMAIN = "." + env.str("BK_DOMAIN")


# paas hosts
# 用户管理内部接口地址
BK_USERMGR_HOST = env.str("BK_USERMGR_LOCAL_ADDR", "backend.bk-usermgr.svc")

# external config
# license
CERTIFICATE_DIR = env.str("BK_PAAS_LOGIN_CERT_PATH")
CERTIFICATE_SERVER_DOMAIN = env.str("BK_PAAS_LOGIN_CERT_SERVER_LOCAL_ADDR")


# cookie 有效期，默认为1天
BK_COOKIE_AGE = env.int("BK_PAAS_LOGIN_COOKIE_AGE", 60 * 60 * 24)
# bk_token 校验有效期校验时间允许误差，防止多台机器时间不同步,默认1分钟
BK_TOKEN_OFFSET_ERROR_TIME = env.int("BK_PAAS_LOGIN_TOKEN_OFFSET_ERROR_TIME", 60)
# 无操作 失效期，默认2个小时. 长时间误操作, 登录态已过期
BK_INACTIVE_COOKIE_AGE = env.int("BK_PAAS_LOGIN_INACTIVE_COOKIE_AGE", 60 * 60 * 2)

# session in cookie secure; uncomment this if you need a secure cookie
# if HTTP_SCHEMA == "https":
#     SESSION_COOKIE_SECURE = True
