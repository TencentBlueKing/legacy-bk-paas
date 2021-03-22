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

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

try:
    import pymysql

    pymysql.version_info = (1, 3, 13, "final", 0)
    pymysql.install_as_MySQLdb()
except Exception:
    pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "hg@5x(5f!fn*gb!fdx=ca7l+w=b#g509p^sjxn47%6^5q=xwxu"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = (
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "api",
)

MIDDLEWARE_CLASSES = (
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.auth.middleware.SessionAuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.security.SecurityMiddleware",
)

ROOT_URLCONF = "controller.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI_APPLICATION = 'controller.wsgi.application'
WSGI_APPLICATION = "wsgi.application"


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = "zh-hans"
# TIME_ZONE = 'Etc/GMT%+d' % ((time.altzone if time.daylight else time.timezone) / 3600)
USE_I18N = True
USE_L10N = True

# timezone
TIME_ZONE = "Asia/Shanghai"
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = "/static/"
APP_URL_REGEX = "[a-z_0-9-]+"


# logging

LOGGER_LEVEL = "DEBUG"

PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(PROJECT_PATH))

LOGGING_DIR = os.environ.get("PAAS_LOGGING_DIR") or os.path.join(os.path.dirname(BASE_DIR), "logs/open_paas")
if not os.path.exists(LOGGING_DIR):
    os.mkdir(LOGGING_DIR)

# 10M
LOG_MAX_BYTES = 1024 * 1024 * 10
LOG_BACKUP_COUNT = 10
LOG_CLASS = "logging.handlers.RotatingFileHandler"
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s [%(asctime)s] %(pathname)s %(lineno)d %(funcName)s %(process)d %(thread)d \n \t %(message)s \n",  # noqa
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "simple": {"format": "%(levelname)s %(message)s \n"},
    },
    "handlers": {
        "null": {
            "level": "DEBUG",
            "class": "logging.NullHandler",
        },
        "mail_admins": {"level": "ERROR", "class": "django.utils.log.AdminEmailHandler"},
        "console": {"level": "DEBUG", "class": "logging.StreamHandler", "formatter": "simple"},
        "root": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "appengine.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
        "wb_mysql": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "appengine_mysql.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
    },
    "loggers": {
        "django": {
            "handlers": ["null"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": True,
        },
        "root": {
            "handlers": ["root"],
            "level": LOGGER_LEVEL,
            "propagate": True,
        },
        "django.db.backends": {
            "handlers": ["wb_mysql"],
            "level": "ERROR",
            "propagate": True,
        },
    },
}

PORT_MAX_TRIES = 5
PORT_POOLS = range(20000, 30000)
