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
