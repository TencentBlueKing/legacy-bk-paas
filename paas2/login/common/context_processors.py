# -*- coding: utf-8 -*-
"""
context_processor for common(setting)
** 除setting外的其他context_processor内容，均采用组件的方式(string)

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from __future__ import unicode_literals

from django.utils import timezone
import urlparse

from django.conf import settings


def site_settings(request):
    real_static_url = urlparse.urljoin(settings.SITE_URL, "." + settings.STATIC_URL)
    cur_domain = request.get_host()
    return {
        "LOGIN_URL": settings.LOGIN_URL,
        "LOGOUT_URL": settings.LOGOUT_URL,
        "STATIC_URL": real_static_url,
        "SITE_URL": settings.SITE_URL,
        "STATIC_VERSION": settings.STATIC_VERSION,
        "CUR_DOMIAN": cur_domain,
        "APP_PATH": request.get_full_path(),
        "NOW": timezone.now(),
        "EDITION": settings.EDITION,
        # 本地 js 后缀名
        "JS_SUFFIX": settings.JS_SUFFIX,
        # 本地 css 后缀名
        "CSS_SUFFIX": settings.CSS_SUFFIX,
    }
