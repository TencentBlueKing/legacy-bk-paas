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

请求app engine的底层方法

Rules:
1. POST/DELETE/PUT: json in - json out, 如果resp.json报错, 则是engine接口问题
2. GET带参数 HEAD不带参数
3. 以统一的header头发送请求
"""

import requests

# from common.log import logging
import logging


def _gen_header(sid, token):
    headers = {"Content-Type": "application/json", "X-ID": str(sid), "X-TOKEN": str(token)}
    return headers


def _http_request(method, url, headers=None, data=None, timeout=None):
    try:
        if method == "GET":
            resp = requests.get(url=url, headers=headers, params=data, timeout=timeout)
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers)
        elif method == "POST":
            resp = requests.post(url=url, headers=headers, json=data)
        elif method == "DELETE":
            resp = requests.delete(url=url, headers=headers, json=data)
        elif method == "PUT":
            resp = requests.put(url=url, headers=headers, json=data)
        else:
            return False, None
    except requests.exceptions.RequestException:
        logging.exception("engine http request error! type: %s, url: %s, data: %s" % (method, url, str(data)))
        return False, None
    except requests.exceptions.Timeout:
        logging.exception("engine http request time out! type: %s, url: %s, data: %s" % (method, url, str(data)))
        return False, None
    else:
        if resp.status_code != 200:
            if resp.status_code == 403:
                return True, resp.json()
            logging.error(
                (
                    "engine http request error! type: %s, url: %s, data: %s, "
                    "response_status_code: %s, response_content: %s"
                )
                % (method, url, str(data), resp.status_code, resp.content)
            )
            return False, None

        return True, resp.json()


def http_get(url, sid, token, params, timeout=None):
    headers = _gen_header(sid, token)
    return _http_request(method="GET", url=url, headers=headers, data=params, timeout=timeout)


def http_post(url, sid, token, params):
    headers = _gen_header(sid, token)
    return _http_request(method="POST", url=url, headers=headers, data=params)
