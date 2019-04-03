# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import os
import time

try:
    import pymysql

    pymysql.install_as_MySQLdb()
except Exception:
    pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'hg@5x(5f!fn*gb!fdx=ca7l+w=b#g509p^sjxn47%6^5q=xwxu'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'controller.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'controller.wsgi.application'
WSGI_APPLICATION = 'wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

# TIME_ZONE = 'Asia/Shanghai'
TIME_ZONE = 'Etc/GMT%+d' % ((time.altzone if time.daylight else time.timezone) / 3600)

USE_I18N = True

USE_L10N = True

#  USE_TZ = True

APP_URL_REGEX = '[a-z_0-9-]+'

# logging

LOGGER_LEVEL = 'DEBUG'

PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT, PROJECT_MODULE_NAME = os.path.split(PROJECT_PATH)
BASE_DIR = os.path.dirname(os.path.dirname(PROJECT_PATH))

LOGGING_DIR = os.environ.get('PAAS_LOGGING_DIR') or os.path.join(PROJECT_ROOT, 'logs')
if not os.path.exists(LOGGING_DIR):
    os.mkdir(LOGGING_DIR)

LOG_CLASS = 'logging.handlers.RotatingFileHandler'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format':
                '%(levelname)s [%(asctime)s] %(pathname)s %(lineno)d %(funcName)s %(process)d %(thread)d \n \t %(message)s \n', # noqa
            # noqa
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s \n'
        },
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'django.utils.log.NullHandler',
        },
        'mail_admins': {
            'level': 'ERROR', 'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'DEBUG', 'class': 'logging.StreamHandler', 'formatter':
                'simple'
        },
        'root': {
            'class': LOG_CLASS, 'formatter': 'verbose', 'filename':
                os.path.join(LOGGING_DIR, 'appengine.log'), 'maxBytes': 1024 * 1024 * 10
        },
        'wb_mysql': {
            'class': LOG_CLASS, 'formatter': 'verbose', 'filename':
                os.path.join(LOGGING_DIR, 'appengine_mysql.log'), 'maxBytes': 1024 * 1024 * 10
        },
    },
    'loggers': {
        'django': {
            'handlers': ['null'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
        },
        'root': {
            'handlers': ['root'],
            'level': LOGGER_LEVEL,
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['wb_mysql'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

HTTP_TIMEOUT = 5
