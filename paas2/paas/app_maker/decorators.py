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

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from app_maker.signature import AppMakerSign
from api.utils import InnerFeedback


def signature_required():
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            feedback = InnerFeedback()
            try:
                sign = AppMakerSign(request)
                sign.clean()
            except Exception as error:
                feedback["result"] = False
                feedback["message"] = u"%s" % error
                feedback["code"] = "1001"
                return JsonResponse(feedback)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
