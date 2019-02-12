# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
"""  # noqa
import requests
from requests.status_codes import codes

from django.conf import settings
from .exceptions import BadResponse


def http_request(method, url, desired_code=codes.ok, **kwargs):
    if "timeout" not in kwargs:
        kwargs["timeout"] = settings.HTTP_TIMEOUT

    resp = requests.request(method, url, **kwargs)
    if resp.status_code == desired_code:
        try:
            return resp.json()
        except Exception:
            return resp

    raise BadResponse(resp)
