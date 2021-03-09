# -*- coding: utf-8 -*-

"""
context_processor for common(setting)
** 除setting外的其他context_processor内容，均采用组件的方式(string)

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""

import datetime

from django.conf import settings
from django.utils.translation import ugettext as _


def site_settings(request):
    return {
        "_": _,
        "LOGIN_URL": settings.LOGIN_URL,
        "LOGOUT_URL": settings.LOGOUT_URL,
        "STATIC_URL": settings.STATIC_URL,
        "SITE_URL": settings.SITE_URL,
        "STATIC_VERSION": settings.STATIC_VERSION,
        "APP_PATH": request.get_full_path(),
        "NOW": datetime.datetime.now(),
        "EDITION": settings.EDITION,
        # 本地 js 后缀名
        "JS_SUFFIX": settings.JS_SUFFIX,
        # 本地 css 后缀名
        "CSS_SUFFIX": settings.CSS_SUFFIX,
        "EXTERNAL_THEME": settings.EXTERNAL_THEME,
    }
