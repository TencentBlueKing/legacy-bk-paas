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

# Database
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
SECRET_KEY = env.str("BK_PAAS_APPENGINE_SECRET_KEY")

CONSUL_HTTP_PORT = env.str("BK_PAAS_APPENGINE_CONSUL_HTTP_PORT")
CONSUL_HTTPS_PORT = env.str("BK_PAAS_APPENGINE_CONSUL_HTTPS_PORT")
CONSUL_SERVER_CA_CERT = env.str("BK_PAAS_APPENGINE_CONSUL_CA_FILE")
CONSUL_CLIENT_CERT_FILE = env.str("BK_PAAS_APPENGINE_CONSUL_CLIENT_CERT_FILE")
CONSUL_CLIENT_KEY_FILE = env.str("BK_PAAS_APPENGINE_CONSUL_CLIENT_KEY_FILE")
