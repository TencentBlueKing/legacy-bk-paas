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

from django.http import JsonResponse
from django.utils.decorators import available_attrs
from django.utils.translation import ugettext as _

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from django.conf import settings

from api.signature import Sign
from api.utils import InnerFeedback, InnerFeedBackClassV2
from api.constants import ApiErrorCodeEnumV2


def signature_required():
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            feedback = InnerFeedback()
            try:
                sign = Sign(request)
                sign.clean()
            except Exception as error:
                feedback["result"] = False
                feedback["message"] = u"%s" % error
                feedback["code"] = "1001"
                return JsonResponse(feedback)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator


def esb_required():
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            feedback = InnerFeedback()
            x_app_token = request.META.get("HTTP_X_APP_TOKEN")
            x_app_code = request.META.get("HTTP_X_APP_CODE")
            if not (x_app_code == "esb" and x_app_token == settings.ESB_TOKEN):
                feedback["result"] = False
                feedback["message"] = _(u"API网关鉴权失败")
                feedback["code"] = "1001"
                return JsonResponse(feedback)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator


def esb_required_v2():
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            feedback = InnerFeedBackClassV2()
            x_app_token = request.META.get("HTTP_X_APP_TOKEN")
            x_app_code = request.META.get("HTTP_X_APP_CODE")
            if not (x_app_code == "esb" and x_app_token == settings.ESB_TOKEN):
                feedback["message"] = _(u"API网关鉴权失败")
                feedback["code"] = ApiErrorCodeEnumV2.ESB_NOT_VALID
                return JsonResponse(feedback.get_json())
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator


def bk_paas_backend_required(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        x_app_token = request.META.get("HTTP_X_APP_TOKEN")
        x_app_code = request.META.get("HTTP_X_APP_CODE")
        if not (x_app_code == "bk_paas" and x_app_token == settings.ESB_TOKEN):
            return JsonResponse(
                {
                    "bk_error_msg": "invalid authorization",
                    "bk_error_code": ApiErrorCodeEnumV2.NO_PERMISSION,
                    "data": {},
                }
            )
        return view_func(request, *args, **kwargs)

    return _wrapped_view
