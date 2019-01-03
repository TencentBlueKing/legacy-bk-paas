# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals

import requests

from common.log import logger


def _gen_header():
    headers = {
        "Content-Type": "application/json",
    }
    return headers


def _http_request(method, url, headers=None, data=None, verify=None, cert=None):
    try:
        if method == "GET":
            resp = requests.get(url=url, headers=headers, params=data, verify=verify, cert=cert)
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers, verify=verify, cert=cert)
        elif method == "POST":
            resp = requests.post(url=url, headers=headers, json=data, verify=verify, cert=cert)
        elif method == "DELETE":
            resp = requests.delete(url=url, headers=headers, json=data, verify=verify, cert=cert)
        elif method == "PUT":
            resp = requests.put(url=url, headers=headers, json=data, verify=verify, cert=cert)
        else:
            return False, None
    except requests.exceptions.RequestException:
        logger.exception("http request error! type: %s, url: %s, data: %s" % (
            method, url, str(data)))
        return False, None
    else:
        if resp.status_code != 200:
            content = resp.content[:100] if resp.content else ''
            error_msg = ("http request error! type: %s, url: %s, data: %s, "
                         "response_status_code: %s, response_content: %s")
            logger.error(error_msg % (method, url, str(data), resp.status_code, content))
            return False, None

        return True, resp.json()


def http_get(url, data, verify=None, cert=None):
    headers = _gen_header()
    return _http_request(method="GET", url=url, headers=headers, data=data, verify=verify, cert=cert)


def http_post(url, data, verify=None, cert=None):
    headers = _gen_header()
    return _http_request(method="POST", url=url, headers=headers, data=data, verify=verify, cert=cert)


def http_delete(url, data, verify=None, cert=None):
    headers = _gen_header()
    return _http_request(method="DELETE", url=url, headers=headers, data=data, verify=verify, cert=cert)
