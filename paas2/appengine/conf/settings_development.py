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

# Generic Django project settings
DEBUG = False

# Database
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

# secure
SECRET_KEY = "vLqVTUsFBCGOZbihrjHMuRaQwKpkgoeIXtzJmlDEyNYAxfWdcPS"

# etcd services, ETCD_SERVERS = (('192.168.1.1', 4001), ('192.168.1.2', 4001), ('192.168.1.3', 4001))
IS_ETCD_ON = False
ETCD_SERVERS = "(('127.0.0.1', 4001), )"

CONSUL_HTTP_PORT = "CONSUL_HTTP_PORT"
CONSUL_HTTPS_PORT = "CONSUL_HTTPS_PORT"
CONSUL_SERVER_CA_CERT = "CONSUL_CA_FILE"
CONSUL_CLIENT_CERT_FILE = "CONSUL_CLIENT_CERT_FILE"
CONSUL_CLIENT_KEY_FILE = "CONSUL_CLIENT_KEY_FILE"
