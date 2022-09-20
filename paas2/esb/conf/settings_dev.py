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


from .default import *  # noqa: F403,F401

# Generic Django project settings
DEBUG = env.bool("DEBUG", False)

# Database
DATABASES = {
    "default": {
        "ENGINE": env.str("BK_PAAS_ESB_DATABASE_ENGINE", "django.db.backends.mysql"),
        "NAME": "tc_open_paas",
        "USER": "apigw-dev",
        "PASSWORD": "Dev#igskynX64tre",
        "HOST": "127.0.0.1",
        "PORT": 3306,
        "TEST_CHARSET": env.str("DATABASE_TEST_CHARSET", "utf8"),
        "TEST_COLLATION": env.str(
            "DATABASE_TEST_COLLATION",
            "utf8_general_ci",
        ),
    }
}

SECRET_KEY = "@3dqbfh23ihs)*ffdck21g(f)+)95qnj4i3n2m-yhafl#&@#hx"

ESB_TOKEN = ""
PAAS_HOST = ""
SSL_ROOT_DIR = ""

# Third party system host
# host for bk login
HOST_BK_LOGIN = "http://127.0.0.1:17329"

# host for cc
HOST_CC = env.str("BK_CMDB_URL", "")

# host for cc v3
HOST_CC_V3 = env.str("BK_CMDB_V3_URL", "")

# host for job, default 80 for http/8443 for https
HOST_JOB = env.str("BK_JOB_URL", "")

# host for gse, default 80 for http/8443 for https
HOST_GSE = env.str("BK_GSE_URL", "")

# host for gse proc
GSE_PROC_HOST = env.str("BK_GSE_PROC_HOST", "")
GSE_PROC_PORT = env.str("BK_GSE_PROC_PORT", "")

# host for gse cacheapi
GSE_CACHEAPI_HOST = env.str("BK_GSE_CACHEAPI_HOST", "")
GSE_CACHEAPI_PORT = env.str("BK_GSE_CACHEAPI_PORT", "")

# host for gse process management service
GSE_PMS_HOST = env.str("BK_GSE_PMS_URL", "")

# host for DATA，数据平台监控告警系统, default 80 for http/8443 for https
HOST_DATA = env.str("BK_DATA_URL", "")

# host for DATA BKSQL service
DATA_BKSQL_HOST = env.str("BK_DATA_BKSQL_URL", "")

# host for DATA PROCESSORAPI
DATA_PROCESSORAPI_HOST = env.str("BK_DATA_PROCESSORAPI_URL", "")

# host for DATA Modelflow service
DATA_MODELFLOW_HOST = env.str("BK_DATA_MODELFLOW_URL", "")

# host for data v3
DATAV3_AUTHAPI_HOST = env.str("BK_DATA_V3_AUTHAPI_URL", "")
DATAV3_ACCESSAPI_HOST = env.str("BK_DATA_V3_ACCESSAPI_URL", "")
DATAV3_DATABUSAPI_HOST = env.str("BK_DATA_V3_DATABUSAPI_URL", "")
DATAV3_DATAFLOWAPI_HOST = env.str("BK_DATA_V3_DATAFLOWAPI_URL", "")
DATAV3_DATAMANAGEAPI_HOST = env.str("BK_DATA_V3_DATAMANAGEAPI_URL", "")
DATAV3_DATAQUERYAPI_HOST = env.str("BK_DATA_V3_DATAQUERYAPI_URL", "")
DATAV3_METAAPI_HOST = env.str("BK_DATA_V3_METAAPI_URL", "")
DATAV3_STOREKITAPI_HOST = env.str("BK_DATA_V3_STOREKITAPI_URL", "")
DATAV3_BKSQL_HOST = env.str("BK_DATA_V3_BKSQL_URL", "")
DATAV3_MODELAPI_HOST = env.str("BK_DATA_V3_MODELAPI_URL", "")
DATAV3_DATACUBEAPI_HOST = env.str("BK_DATA_V3_DATACUBEAPI_URL", "")
DATAV3_ALGORITHMAPI_HOST = env.str("BK_DATA_V3_ALGORITHMAPI_URL", "")
DATAV3_RESOURCECENTERAPI_HOST = env.str("BK_DATA_V3_RESOURCECENTERAPI_URL", "")

# host for fta,  default 80 for http/8443 for https
HOST_FTA = env.str("BK_FTA_URL", "")

# Redis config
USE_SENTINEL = env.bool("BK_PAAS_ESB_REDIS_SENTINEL_MODE", False)
REDIS_HOST = env.str("BK_PAAS_ESB_REDIS_HOST", "")
REDIS_PORT = env.int("BK_PAAS_ESB_REDIS_PORT", 6379)
REDIS_PASSWORD = env.str("BK_PAAS_ESB_REDIS_PASSWORD", "")
REDIS_MASTER_NAME = env.str("BK_PAAS_ESB_REDIS_MASTER_NAME", "")
REDIS_DB = env.int("BK_PAAS_ESB_REDIS_DATABASE", 0)

# devops
DEVOPS_HOST = env.str("BK_DEVOPS_URL", "")

# cicdkit
CICDKIT_HOST = env.str("BK_CICDKIT_URL", "")

# monitor
MONITOR_HOST = env.str("BK_MONITOR_URL", "")
MONITOR_V3_HOST = env.str("BK_MONITOR_V3_URL", "")

# user_manage
USERMGR_HOST = env.str("BK_USERMGR_URL", "")

# bk_log
BK_LOG_HOST = env.str("BK_LOG_URL", "")

# nodeman
NODEMAN_HOST = env.str("BK_NODEMAN_URL", "")

BK_SSM_API_URL = env.str("BK_SSM_API_URL", "")
BK_SSM_ACCESS_TOKEN_CACHE_MAXSIZE = env.int("BK_SSM_ACCESS_TOKEN_CACHE_MAXSIZE", 2000)
BK_SSM_ACCESS_TOKEN_CACHE_TTL_SECONDS = env.int("BK_SSM_ACCESS_TOKEN_CACHE_TTL_SECONDS", 300)

BK_TOKEN_CACHE_MAXSIZE = env.int("BK_TOKEN_CACHE_MAXSIZE", 2000)
BK_TOKEN_CACHE_TTL_SECONDS = env.int("BK_TOKEN_CACHE_TTL_SECONDS", 60)
