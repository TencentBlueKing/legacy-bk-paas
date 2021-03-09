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


from __future__ import unicode_literals

from django.conf import settings
from django.http import JsonResponse

from api.constants import ApiErrorCodeEnum, ApiErrorCodeEnumV2, ApiErrorCodeEnumV3


def is_request_from_esb(request):
    """
    请求是否来自ESB
    """
    x_app_token = request.META.get("HTTP_X_APP_TOKEN")
    x_app_code = request.META.get("HTTP_X_APP_CODE")
    if x_app_code == "esb" and x_app_token == settings.ESB_TOKEN:
        return True
    return False


########
#  v1  #
########


class APIV1BaseJsonResponse(JsonResponse):
    def __init__(self, result, code, message, data=None):
        data = data if data is not None else {}
        json_data = {"result": result, "code": code, "message": message, "data": data}
        super(APIV1BaseJsonResponse, self).__init__(json_data)


class APIV1FailJsonResponse(APIV1BaseJsonResponse):
    def __init__(self, message, **kwargs):
        code = kwargs.get("code") or ApiErrorCodeEnum.PARAM_NOT_VALID
        data = kwargs.get("data")
        super(APIV1FailJsonResponse, self).__init__(False, code, message, data=data)


class APIV1OKJsonResponse(APIV1BaseJsonResponse):
    def __init__(self, message, **kwargs):
        data = kwargs.get("data")
        super(APIV1OKJsonResponse, self).__init__(True, ApiErrorCodeEnum.SUCCESS, message, data=data)


########
#  v2  #
########


class APIV2BaseJsonResponse(JsonResponse):
    def __init__(self, result, code, message, data=None):
        data = data if data is not None else {}
        json_data = {"result": result, "bk_error_code": code, "bk_error_msg": message, "data": data}
        super(APIV2BaseJsonResponse, self).__init__(json_data)


class APIV2FailJsonResponse(APIV2BaseJsonResponse):
    def __init__(self, message, **kwargs):
        code = kwargs.get("code") or ApiErrorCodeEnumV2.PARAM_NOT_VALID
        data = kwargs.get("data")
        super(APIV2FailJsonResponse, self).__init__(False, code, message, data=data)


class APIV2OKJsonResponse(APIV2BaseJsonResponse):
    def __init__(self, message, **kwargs):
        data = kwargs.get("data")
        super(APIV2OKJsonResponse, self).__init__(True, ApiErrorCodeEnumV2.SUCCESS, message, data=data)


########
#  v3  #
########
# result/code/message/data
# code is int


class APIV3BaseJsonResponse(JsonResponse):
    def __init__(self, result, code, message, data=None):
        data = data if data is not None else {}
        json_data = {"result": result, "code": code, "message": message, "data": data}
        super(APIV3BaseJsonResponse, self).__init__(json_data)


class APIV3FailJsonResponse(APIV3BaseJsonResponse):
    def __init__(self, message, **kwargs):
        code = kwargs.get("code") or ApiErrorCodeEnumV3.PARAM_NOT_VALID
        data = kwargs.get("data")
        super(APIV3FailJsonResponse, self).__init__(False, code, message, data=data)


class APIV3OKJsonResponse(APIV3BaseJsonResponse):
    def __init__(self, message, **kwargs):
        data = kwargs.get("data")
        super(APIV3OKJsonResponse, self).__init__(True, ApiErrorCodeEnumV3.SUCCESS, message, data=data)
