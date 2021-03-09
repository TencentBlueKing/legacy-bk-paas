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

from bk_iam.signals import _app_creator_permission


class FailJsonResponse(JsonResponse):
    def __init__(self, code, message, **kwargs):
        data = {}
        if kwargs:
            data.update(kwargs)

        # high priority
        data.update({"code": code, "message": message, "data": {}})

        super(FailJsonResponse, self).__init__(data)


class OKJsonResponse(JsonResponse):
    def __init__(self, data, **kwargs):
        body = {}
        if kwargs:
            body.update(kwargs)

        # high priority
        body.update({"code": 0, "message": "ok", "data": data})

        super(OKJsonResponse, self).__init__(body)


def apply_app_creator_permission(app_code, app_name, username):
    data = {
        "app_code": app_code,
        "app_name": app_name,
        "username": username,
    }
    _app_creator_permission.send(sender="open_paas", **data)
