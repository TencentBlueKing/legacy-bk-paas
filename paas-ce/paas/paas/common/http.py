# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

请求登录的http基础方法

Rules:
1. POST/DELETE/PUT: json in - json out, 如果resp.json报错, 则是登录接口问题
2. GET带参数 HEAD不带参数
3. 以统一的header头发送请求
""" # noqa


from __future__ import unicode_literals

import requests
from common.log import logger


def _gen_header():
    headers = {
        "Content-Type": "application/json",
    }
    return headers


def _http_request(method, url, headers=None, data=None, timeout=None, verify=None, cert=None, cookies=None):
    try:
        if method == "GET":
            resp = requests.get(url=url, headers=headers, params=data, timeout=timeout,
                                verify=verify, cert=cert, cookies=cookies)
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers, verify=verify, cert=cert, cookies=cookies)
        elif method == "POST":
            resp = requests.post(url=url, headers=headers, json=data, timeout=timeout,
                                 verify=verify, cert=cert, cookies=cookies)
        elif method == "DELETE":
            resp = requests.delete(url=url, headers=headers, json=data, timeout=timeout,
                                   verify=verify, cert=cert, cookies=cookies)
        elif method == "PUT":
            resp = requests.put(url=url, headers=headers, json=data, timeout=timeout,
                                verify=verify, cert=cert, cookies=cookies)
        else:
            return False, None
    except requests.exceptions.RequestException:
        logger.exception("http request error! method: %s, url: %s, data: %s", method, url, data)
        return False, None
    else:
        if resp.status_code != 200:
            content = resp.content[:100] if resp.content else ''
            error_msg = ("http request fail! method: %s, url: %s, data: %s, "
                         "response_status_code: %s, response_content: %s")
            logger.error(error_msg % (method, url, str(data), resp.status_code, content))
            return False, None

        return True, resp.json()


def http_get(url, data, headers=None, verify=None, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(method="GET", url=url, headers=headers, data=data,
                         verify=verify, cert=cert, timeout=timeout, cookies=cookies)


def http_post(url, data, headers=None, verify=None, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(method="POST", url=url, headers=headers, data=data, timeout=timeout,
                         verify=verify, cert=cert, cookies=cookies)


def http_put(url, data, headers=None, verify=None, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(method="PUT", url=url, headers=headers, data=data,
                         timeout=timeout, verify=verify, cert=cert, cookies=cookies)


def http_delete(url, data, headers=None, verify=None, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(method="DELETE", url=url, headers=headers, data=data, timeout=timeout,
                         verify=verify, cert=cert, cookies=cookies)
