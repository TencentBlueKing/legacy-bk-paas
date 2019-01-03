# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.http import JsonResponse
from django.utils.decorators import available_attrs

from api.constants import ApiErrorCodeEnumV2

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.


def esb_required(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        x_app_token = request.META.get('HTTP_X_APP_TOKEN')
        x_app_code = request.META.get('HTTP_X_APP_CODE')
        if not (x_app_code == 'esb' and x_app_token == settings.ESB_TOKEN):
            return JsonResponse({
                "result": False,
                "code": "1001",
                "message": "API网关鉴权失败",
            })
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def esb_required_v2(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        x_app_token = request.META.get('HTTP_X_APP_TOKEN')
        x_app_code = request.META.get('HTTP_X_APP_CODE')
        if not (x_app_code == 'esb' and x_app_token == settings.ESB_TOKEN):
            return JsonResponse({
                "bk_error_msg": "API网关鉴权失败",
                "bk_error_code": ApiErrorCodeEnumV2.ESB_NOT_VALID.value,
                "data": {}
            })
        return view_func(request, *args, **kwargs)
    return _wrapped_view
