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

import os.path

from django.conf import settings

from esb.utils import SmartHost, get_ssl_root_dir


SYSTEM_NAME = "GSE"

DEFAULT_BK_SUPPLIER_ID = 0

# proc service
gse_proc_host = SmartHost(host_prod=settings.GSE_PROC_HOST)
gse_proc_port = settings.GSE_PROC_PORT

# cacheapi service
gse_cacheapi_host = SmartHost(host_prod=getattr(settings, "GSE_CACHEAPI_HOST", ""))
gse_cacheapi_port = getattr(settings, "GSE_CACHEAPI_PORT", "")

# pms
gse_pms_host = SmartHost(
    host_prod=getattr(settings, "GSE_PMS_HOST", ""),
)

# config
gse_config_host = SmartHost(host_prod=getattr(settings, "BK_GSE_CONFIG_ADDR", ""))


# SSL 证书配置
SSL_ROOT_DIR = get_ssl_root_dir()
SERVER_CERT = os.path.join(SSL_ROOT_DIR, "gseca.crt")
CLIENT_CERT = os.path.join(SSL_ROOT_DIR, "gse_esb_api_client.crt")
CLIENT_KEY = os.path.join(SSL_ROOT_DIR, "gse_esb_api_client.key")
