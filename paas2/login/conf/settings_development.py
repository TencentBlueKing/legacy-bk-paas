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

# 要启用企业微信登录视图，需要设置WECOM_LOGIN为True，同时在ee_login.settings_login设置自定义登录
WECOM_LOGIN= True
CUSTOM_AUTHENTICATION_BACKEND = ""
try:
    custom_conf_module_path = "ee_login.settings_login"

    custom_conf_module = __import__(custom_conf_module_path, globals(), locals(), ["*"])
    LOGIN_TYPE = getattr(custom_conf_module, "LOGIN_TYPE", "bk_login")

    CUSTOM_LOGIN_VIEW = getattr(custom_conf_module, "CUSTOM_LOGIN_VIEW", "")
    CUSTOM_AUTHENTICATION_BACKEND = getattr(custom_conf_module, "CUSTOM_AUTHENTICATION_BACKEND", "")
except ImportError, e:
    print "load custom_login settings fail!", e
    LOGIN_TYPE = "bk_login"

AUTHENTICATION_BACKENDS_DICT = {
    "bk_login": ["backends.bk.BkUserBackend"],
    "custom_login": [CUSTOM_AUTHENTICATION_BACKEND],
}
if WECOM_LOGIN:
    AUTHENTICATION_BACKENDS_DICT = {
        "bk_login": ["backends.bk.BkUserBackend"],
        "custom_login": ["backends.bk.BkUserBackend", CUSTOM_AUTHENTICATION_BACKEND],
    }
AUTHENTICATION_BACKENDS = AUTHENTICATION_BACKENDS_DICT.get(LOGIN_TYPE, ["bkaccount.backends.BkRemoteUserBackend"])

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
