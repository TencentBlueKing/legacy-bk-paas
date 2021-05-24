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

import base64

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from django.utils.decorators import available_attrs
from django.utils.encoding import force_text

from bk_iam.utils import FailJsonResponse
from common.bk_iam import Permission


def basic_auth_required(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION", "").split()

        if len(auth) != 2 or auth[0].lower() != "basic":
            response = FailJsonResponse(401, "UNAUTHORIZED")
            response["WWW-Authenticate"] = 'Basic realm="%s"' % "Basci Auth Protected"
            return response

        # username, password = base64.b64decode(auth[1]).split(":")
        username, password = force_text(base64.b64decode(auth[1])).split(":")

        if username != "bk_iam" or password != Permission().get_token():
            response = FailJsonResponse(401, "UNAUTHORIZED")
            return response

        response = view_func(request, *args, **kwargs)
        response["X-Request-Id"] = request.META.get("HTTP_X_REQUEST_ID", "")
        return response

    return _wrapped_view
