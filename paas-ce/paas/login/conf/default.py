# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys
from django.utils.functional import SimpleLazyObject

try:
    import pymysql
    pymysql.install_as_MySQLdb()
except Exception:
    pass

PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT, PROJECT_MODULE_NAME = os.path.split(PROJECT_PATH)
BASE_DIR = os.path.dirname(os.path.dirname(PROJECT_PATH))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'o7(025idh*fj@)ohujum-ilfxl^n=@d&$xz!_$$7s$8jopd5r#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

CSRF_COOKIE_NAME = 'bklogin_csrftoken'

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bkaccount',
    'bk_i18n',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'bkaccount.middlewares.LoginMiddleware',
    'bk_i18n.middlewares.LanguageMiddleware',
    'bk_i18n.middlewares.ApiLanguageMiddleware',
    'bk_i18n.middlewares.TimezoneMiddleware',
)

ROOT_URLCONF = 'urls'

# mako template dir
MAKO_TEMPLATE_DIR = os.path.join(PROJECT_ROOT, 'templates')
MAKO_TEMPLATE_MODULE_DIR = os.path.join(PROJECT_ROOT, 'templates_module')


TEMPLATE_CONTEXT_PROCESSORS = (
    'django.template.context_processors.debug',
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.csrf',
    'common.context_processors.site_settings',
    'django.core.context_processors.i18n',
    'django.contrib.messages.context_processors.messages',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # django template dir
        'DIRS': (
            # 绝对路径，比如"/home/html/django_templates" or "C:/www/django/templates".
            os.path.join(PROJECT_ROOT, 'templates'),
        ),
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': list(TEMPLATE_CONTEXT_PROCESSORS),
        },
    },
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
SITE_URL = '/login/'

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(PROJECT_ROOT, 'static'),
)

STATIC_VERSION = '0.0.6'

# CSS 文件后缀名
CSS_SUFFIX = 'min.css'
# JS 文件后缀名
JS_SUFFIX = 'min.js'

# CSRF 验证失败处理函数
CSRF_FAILURE_VIEW = 'bkaccount.views.csrf_failure'

##################
# Login Config   #
##################
# 蓝鲸登录方式：bk_login，自定义登录方式：custom_login
LOGIN_TYPE = 'bk_login'
CUSTOM_LOGIN_VIEW = ''
CUSTOM_AUTHENTICATION_BACKEND = ''
try:
    custom_conf_module_path = "ee_login.settings_login"
    custom_conf_module = __import__(custom_conf_module_path, globals(), locals(), ['*'])
    LOGIN_TYPE = getattr(custom_conf_module, 'LOGIN_TYPE', 'bk_login')
    CUSTOM_LOGIN_VIEW = getattr(custom_conf_module, 'CUSTOM_LOGIN_VIEW', '')
    CUSTOM_AUTHENTICATION_BACKEND = getattr(custom_conf_module, 'CUSTOM_AUTHENTICATION_BACKEND', '')
except ImportError, e:
    LOGIN_TYPE = 'bk_login'
##################
# AUTHENTICATION #
##################
LOGIN_URL = SimpleLazyObject(lambda: getattr(getattr(sys.modules['django.conf'], 'settings'), 'SITE_URL'))

LOGOUT_URL = SimpleLazyObject(lambda: '%slogout/'
                              % getattr(getattr(sys.modules['django.conf'], 'settings'), 'SITE_URL'))

LOGIN_COMPLETE_URL = SimpleLazyObject(lambda: "%s://%s%s" % (
    getattr(getattr(sys.modules['django.conf'], 'settings'), 'HTTP_SCHEMA'),
    getattr(getattr(sys.modules['django.conf'], 'settings'), 'PAAS_DOMAIN'),
    getattr(getattr(sys.modules['django.conf'], 'settings'), 'SITE_URL')))

AUTH_USER_MODEL = 'bkaccount.BkUser'

AUTHENTICATION_BACKENDS_DICT = {
    'bk_login': ('bkaccount.backends.BkBackend', 'django.contrib.auth.backends.ModelBackend'),
    'custom_login': ('bkaccount.backends.BkBackend', CUSTOM_AUTHENTICATION_BACKEND),
}

AUTHENTICATION_BACKENDS = AUTHENTICATION_BACKENDS_DICT.get(
    LOGIN_TYPE, ('bkaccount.backends.BkBackend', 'django.contrib.auth.backends.ModelBackend'))

WSGI_APPLICATION = 'wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
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
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = True
TIMEZONE_SESSION_KEY = 'django_timezone'

# language
# 避免循环引用
_ = lambda s: s  # noqa
LANGUAGES = (
    ('en', _(u'English')),
    ('zh-hans', _(u'简体中文')),
)
LANGUAGE_CODE = 'zh-hans'
LANGUAGE_COOKIE_DOMAIN = SimpleLazyObject(lambda: getattr(getattr(sys.modules['django.conf'], 'settings'),
                                                          'BK_COOKIE_DOMAIN'))
LANGUAGE_COOKIE_NAME = 'blueking_language'
LANGUAGE_COOKIE_PATH = '/'
LOCALE_PATHS = (
    os.path.join(PROJECT_ROOT, 'locale'),
)

# cookie名称
BK_COOKIE_NAME = 'bk_token'
# cookie 有效期，默认为1天
BK_COOKIE_AGE = 60 * 60 * 24
# bk_token 校验有效期校验时间允许误差，防止多台机器时间不同步,默认1分钟
BK_TOKEN_OFFSET_ERROR_TIME = 60

# APP_ENGINE 状态查询超时时间
EVENT_STATE_EXPIRE_SECONDS = 180
HISTORY_EVENT_STATE_EXPIRE_SECONDS = 1800

##################
# 初始化用户信息 #
##################
USERNAME = 'admin'
PASSWORD = 'blueking'

# logging config
LOGGER_LEVEL = 'DEBUG'

LOGGING_DIR = os.environ.get('PAAS_LOGGING_DIR') or os.path.join(PROJECT_ROOT, 'logs')
if not os.path.exists(LOGGING_DIR):
    os.mkdir(LOGGING_DIR)

# 10M
LOG_MAX_BYTES = 1024 * 1024 * 10
LOG_BACKUP_COUNT = 10
LOG_CLASS = 'logging.handlers.RotatingFileHandler'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format':
            '%(levelname)s [%(asctime)s] %(pathname)s %(lineno)d %(funcName)s %(process)d %(thread)d \n \t %(message)s \n',  # noqa
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
            'class': LOG_CLASS,
            'formatter': 'verbose',
            'filename': os.path.join(LOGGING_DIR, 'login.log'),
            'maxBytes': LOG_MAX_BYTES,
            'backupCount': LOG_BACKUP_COUNT
        },
        'wb_mysql': {
            'class': LOG_CLASS,
            'formatter': 'verbose',
            'filename': os.path.join(LOGGING_DIR, 'login_mysql.log'),
            'maxBytes': LOG_MAX_BYTES,
            'backupCount': LOG_BACKUP_COUNT
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
