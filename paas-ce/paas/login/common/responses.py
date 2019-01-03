# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.http import JsonResponse

from bkaccount.constants import ApiErrorCodeEnum, ApiErrorCodeEnumV2


class FailJsonResponse(JsonResponse):
    def __init__(self, message, **kwargs):
        data = {}
        if kwargs:
            data.update(kwargs)

        # high priority
        data.update({
            "result": False,
            "message": message
        })

        super(FailJsonResponse, self).__init__(data)


class OKJsonResponse(JsonResponse):
    def __init__(self, message, **kwargs):
        data = {}
        if kwargs:
            data.update(kwargs)

        # high priority
        data.update({
            "result": True,
            "message": message
        })

        super(OKJsonResponse, self).__init__(data)


class ApiV1BaseJsonResponse(JsonResponse):
    def __init__(self, result, code, message, data=None):
        data = data if data is not None else {}
        json_data = {'result': result, 'code': code, 'message': message, 'data': data}
        super(ApiV1BaseJsonResponse, self).__init__(json_data)


class ApiV1FailJsonResponse(ApiV1BaseJsonResponse):
    def __init__(self, message, **kwargs):
        code = kwargs.get('code') or ApiErrorCodeEnum.PARAM_NOT_VALID
        data = kwargs.get('data')
        super(ApiV1FailJsonResponse, self).__init__(False, code, message, data=data)


class ApiV1OKJsonResponse(ApiV1BaseJsonResponse):
    def __init__(self, message, **kwargs):
        data = kwargs.get('data')
        super(ApiV1OKJsonResponse, self).__init__(True, ApiErrorCodeEnum.SUCCESS, message, data=data)


class ApiV2BaseJsonResponse(JsonResponse):
    def __init__(self, result, code, message, data=None):
        data = data if data is not None else {}
        json_data = {'result': result, 'bk_error_code': code, 'bk_error_msg': message, 'data': data}
        super(ApiV2BaseJsonResponse, self).__init__(json_data)


class ApiV2FailJsonResponse(ApiV2BaseJsonResponse):
    def __init__(self, message, **kwargs):
        code = kwargs.get('code') or ApiErrorCodeEnumV2.PARAM_NOT_VALID
        data = kwargs.get('data')
        super(ApiV2FailJsonResponse, self).__init__(False, code, message, data=data)


class ApiV2OKJsonResponse(ApiV2BaseJsonResponse):
    def __init__(self, message, **kwargs):
        data = kwargs.get('data')
        super(ApiV2OKJsonResponse, self).__init__(True, ApiErrorCodeEnumV2.SUCCESS, message, data=data)
