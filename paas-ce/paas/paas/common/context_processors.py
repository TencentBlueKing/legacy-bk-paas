# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

context_processor for common(setting)
** 除setting外的其他context_processor内容，均采用组件的方式(string)
""" # noqa

from __future__ import unicode_literals

import datetime

from django.conf import settings


def site_settings(request):
    return {
        'LOGIN_URL': settings.LOGIN_URL,
        'LOGOUT_URL': settings.LOGOUT_URL,
        'STATIC_URL': settings.STATIC_URL,
        'SITE_URL': settings.SITE_URL,
        'STATIC_VERSION': settings.STATIC_VERSION,

        'APP_PATH': request.get_full_path(),
        'NOW': datetime.datetime.now(),

        # 本地 js 后缀名
        'JS_SUFFIX': settings.JS_SUFFIX,
        # 本地 css 后缀名
        'CSS_SUFFIX': settings.CSS_SUFFIX
    }
