# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

# Generic Django project settings
DEBUG = False

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}


# Log settings
LOG_LEVEL = 'INFO'

SECRET_KEY = 'XEz7VLlQNdIq9iFl1t6LtWobQEcG4ayoPa2esHwatkHZxiuDf0'

# esb app_token
ESB_TOKEN = '41f076b7-afce-46eb-9e85-dab245eb0931'

# paas host
PAAS_HOST = 'bking.com'

# Third party system host
# host for bk login
HOST_BK_LOGIN = 'bking.com'

# host for cc, default 80 for http/8443 for https
HOST_CC = ''
# host for job, default 80 for http/8443 for https
HOST_JOB = ''
# host for gse, default 80 for http/8443 for https
HOST_GSE = ''
# host for DATA，数据平台监控告警系统, default 80 for http/8443 for https
HOST_DATA = ''
# host for fta,  default 80 for http/8443 for https
HOST_FTA = ''

# esb ssl root dir
SSL_ROOT_DIR = ''
