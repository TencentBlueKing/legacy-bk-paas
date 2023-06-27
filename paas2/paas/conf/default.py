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
import sys

from django.utils.functional import SimpleLazyObject

try:
    import pymysql

    pymysql.version_info = (1, 3, 13, "final", 0)
    pymysql.install_as_MySQLdb()
except Exception:
    pass

PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT, PROJECT_MODULE_NAME = os.path.split(PROJECT_PATH)
BASE_DIR = os.path.dirname(os.path.dirname(PROJECT_PATH))


EDITION = os.environ.get("BK_PAAS_EDITION", "ce")


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/
APP_ID = "bk_paas"
PAAS_APP_ID = "bk_paas"
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "o7(025idh*fj@)ohujum-ilfxl^n=@d&$xz!_$$7s$8jopd5r#"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

CSRF_COOKIE_NAME = "bk_csrftoken"

# Application definition
INSTALLED_APPS = (
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_prometheus",
    "account",
    "bk_i18n",
    "app",
    "app_env",
    "release",
    "engine",
    "saas",
    # 2019-06-19 change to https://docs.bk.tencent.com/download/resource
    # 'resource',
    "bk_app",
    "desktop",
    "analysis",
    "api",
    "app_esb_auth",
    "user_center",
    "audit",
    "esb.bkcore",
    "esb.mainsite",
    "esb.apps.manager",
    "esb.apps.guide",
    "esb.apps.bootstrapform",
    # FOR OPENSOURCE: REMOVE BEGIN
    # FOR OPENSOURCE: REMOVE END
    "esb.apps.api_docs",
    "apigw",
)

if EDITION == "ee":
    INSTALLED_APPS += (
        "app_log",
        "app_monitor",
        "storage",
        "esb.apps.status",
    )
else:
    INSTALLED_APPS += ("home",)


MIDDLEWARE_CLASSES = (
    "django_prometheus.middleware.PrometheusBeforeMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.auth.middleware.SessionAuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "account.middlewares.LoginMiddleware",
    "bk_i18n.middlewares.LanguageMiddleware",
    "bk_i18n.middlewares.ApiLanguageMiddleware",
    "bk_i18n.middlewares.TimezoneMiddleware",
    "common.middlewares.DeveloperCenterAccessMiddleware",
    "common.middlewares.CheckXssMiddleware",
    "django_prometheus.middleware.PrometheusAfterMiddleware",
)

ROOT_URLCONF = "urls"

# mako template dir
MAKO_TEMPLATE_DIR = os.path.join(PROJECT_ROOT, "templates")
MAKO_TEMPLATE_MODULE_DIR = os.path.join(PROJECT_ROOT, "templates_module")


TEMPLATE_CONTEXT_PROCESSORS = (
    "django.template.context_processors.debug",
    "django.template.context_processors.request",
    "django.contrib.auth.context_processors.auth",
    "django.template.context_processors.csrf",
    "common.context_processors.site_settings",  # 自定义模版context，可以在页面中使用STATIC_URL等变量
    "django.template.context_processors.i18n",
    "django.contrib.messages.context_processors.messages",
)

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # django template dir
        "DIRS": (
            # 绝对路径，比如"/home/html/django_templates" or "C:/www/django/templates".
            os.path.join(PROJECT_ROOT, "templates"),
        ),
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": list(TEMPLATE_CONTEXT_PROCESSORS),
        },
    },
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
SITE_URL = "/"

STATIC_URL = SITE_URL + "static/"

STATICFILES_DIRS = (os.path.join(PROJECT_ROOT, "static"),)

STATIC_VERSION = "0.2.1"

# NOTE: SHOULD NOT CHANGE THIS LINE, WILL BE REPLACED WITH THE VERSION in pipeline
PLATFORM_VERSION = "2.0.0"

MEDIA_ROOT = os.path.join(PROJECT_ROOT, "media")
MEDIA_URL = "/media/"

DOWNLOAD_ROOT = os.path.join(PROJECT_ROOT, "download")

# CSS 文件后缀名
CSS_SUFFIX = "min.css"
# JS 文件后缀名
JS_SUFFIX = "min.js"

# 自定义主题
EXTERNAL_THEME = ""

# CSRF 验证失败处理函数
CSRF_FAILURE_VIEW = "account.views.csrf_failure"

##################
# AUTHENTICATION #
##################

LOGIN_URL = "/accounts/login/"

LOGOUT_URL = "/accounts/logout/"

LOGIN_REDIRECT_URL = SITE_URL

AUTH_USER_MODEL = "account.BkUser"

AUTHENTICATION_BACKENDS = ("account.backends.BkBackend", "django.contrib.auth.backends.ModelBackend")

REDIRECT_FIELD_NAME = "c_url"

LOGIN_DOMAIN = ""

WSGI_APPLICATION = "wsgi.application"

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/
# TIME_ZONE = 'Etc/GMT%+d' % ((time.altzone if time.daylight else time.timezone) / 3600)
USE_I18N = True
USE_L10N = True


# timezone
# Default time zone for localization in the UI.
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
TIME_ZONE = "Asia/Shanghai"
USE_TZ = True
TIMEZONE_SESSION_KEY = "django_timezone"

# language
# 避免循环引用
_ = lambda s: s  # noqa
LANGUAGES = (
    ("en", _("English")),
    ("zh-hans", _("简体中文")),
)
LANGUAGE_CODE = "zh-hans"
LANGUAGE_COOKIE_DOMAIN = SimpleLazyObject(
    lambda: getattr(getattr(sys.modules["django.conf"], "settings"), "BK_COOKIE_DOMAIN")
)
LANGUAGE_COOKIE_NAME = "blueking_language"
LANGUAGE_COOKIE_PATH = "/"
LOCALE_PATHS = (
    os.path.join(PROJECT_ROOT, "locale"),
    os.path.join(PROJECT_ROOT, "locale/locale_esb"),
    os.path.join(PROJECT_ROOT, "locale/locale_api"),
)

# cookie名称
BK_COOKIE_NAME = "bk_token"
# cookie 有效期，默认为1天
BK_COOKIE_AGE = 60 * 60 * 24

# APP_ENGINE 状态查询超时时间
# 实时轮询判定状态， 一定要大于agent设置的300
EVENT_STATE_EXPIRE_SECONDS = 360
# 查询历史任务判定状态， 设置为15分钟
HISTORY_EVENT_STATE_EXPIRE_SECONDS = 900

# ELASTICSEARCH 中 日志 index
ES_APP_LOG_INDEX_FMT = "paas_app_log-%s"

#######################
#  CEPH 默认空间大小  #
#######################
# 1GB
DEFAULT_STORAGE_SIZE_KB = 1024 * 1024

##########################
#  APP 部署默认环境变量  #
#########################

# default empty, should not add here! should add in settings_*.py
APP_DEPLOY_ENVS = {}


##################
# App Engine信息 #
##################
ENGINE_APP_INIT_URL = SimpleLazyObject(
    lambda: "%s/v1/apps/init" % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)
ENGINE_APP_RELEASE_URL = SimpleLazyObject(
    lambda: "%s/v1/apps/{app_code}/releases" % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)
ENGINE_APP_EVENT_LOGS_URL = SimpleLazyObject(
    lambda: "%s/v1/apps/{app_code}/events/{event_id}/logs"
    % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)
ENGINE_APP_INFO_URL = SimpleLazyObject(
    lambda: "%s/v1/apps/{app_code}/info" % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)
ENGINE_AGENT_HEALTHZ_URL = SimpleLazyObject(
    lambda: "%s/v1/agents/healthz" % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)
ENGINE_SERVICE_STATUS_URL = SimpleLazyObject(
    lambda: "%s/v1/services/{category}/check/?server_id={server_id}"
    % getattr(sys.modules["settings"], "ENGINE_HOST", "http://127.0.0.1:8000")
)


##################
# 应用访问链接 #
##################
APP_TEST_URL = SimpleLazyObject(
    lambda: "%s://%s/t/{app_code}/"
    % (
        getattr(getattr(sys.modules["django.conf"], "settings"), "HTTP_SCHEMA"),
        getattr(getattr(sys.modules["django.conf"], "settings"), "PAAS_DOMAIN"),
    )
)
APP_PROD_URL = SimpleLazyObject(
    lambda: "%s://%s/o/{app_code}/"
    % (
        getattr(getattr(sys.modules["django.conf"], "settings"), "HTTP_SCHEMA"),
        getattr(getattr(sys.modules["django.conf"], "settings"), "PAAS_DOMAIN"),
    )
)

##################
# 第三方应用链接 #
##################
HOST_CC = ""
HOST_JOB = ""
# PaaS3.0 的访问地址
BK_PAAS3_URL = ""
# API 网关访问地址
BK_APIGW_URL = ""
# API 网关文档中心地址
BK_APIGW_DOC_URL = ""
# 新版网关访问地址模板, e.g. http://bkapi.example.com/api/{api_name}
BK_API_URL_TMPL = ""
# 蓝鲸使用的domain
BK_DOMAIN = ""

# HTTP CONNECTIONS
REQUESTS_POOL_CONNECTIONS = 20
REQUESTS_POOL_MAXSIZE = 20

##################
# ESB 信息 #
##################
ESB_API_LOG_ES_INDEX = "esb_api_log_community"

# logging config
LOGGER_LEVEL = "DEBUG"

LOGGING_DIR = os.environ.get("PAAS_LOGGING_DIR") or os.path.join(os.path.dirname(BASE_DIR), "logs")
if not os.path.exists(LOGGING_DIR):
    os.mkdir(LOGGING_DIR)

# 10M
LOG_MAX_BYTES = 1024 * 1024 * 10
LOG_BACKUP_COUNT = 10
# LOG_CLASS = 'logging.handlers.RotatingFileHandler'
LOG_CLASS = "cloghandler.ConcurrentRotatingFileHandler"
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
            "filename": os.path.join(LOGGING_DIR, "paas.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
        "wb_mysql": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "paas_mysql.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
        "iam": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "paas_iam.log"),
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
        "iam": {
            "handlers": ["iam"],
            "level": LOGGER_LEVEL,
            "propagate": True,
        },
    },
}
