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


from builtins import str
import json
import requests

from common.log import logger
from common.utils.basic import html_escape

"""
请求app engine的底层方法

Rules:
1. POST/DELETE/PUT: json in - json out, 如果resp.json报错, 则是engine接口问题
2. GET带参数 HEAD不带参数
3. 以统一的header头发送请求


注意:
   仅提测, 上线
"""


def _gen_header():
    headers = {
        "Content-Type": "application/json",
    }
    return headers


def _gen_engine_header(app_code, auth_token):
    headers = {
        "Content-Type": "application/json",
        "X-APP-CODE": app_code,
        "X-APP-TOKEN": auth_token,
    }
    return headers


def _get_content(method, url, data, resp):
    content = resp.content[:200] if resp.content else ""
    logger.error(
        ("http request error! type: %s, url: %s, data: %s, " "response_status_code: %s, response_content: %s")
        % (method, url, str(data), resp.status_code, content)
    )

    if resp.status_code == 400:
        try:
            _content = json.loads(content)
            _msg = _content.get("msg")
            if _msg:
                logger.error(_msg)
            return _content
        except Exception:
            pass

    content = html_escape(content)
    _content = {"msg": content}
    return _content


def _http_request(method, url, headers=None, data=None, timeout=None, verify=False):
    try:
        if method == "GET":
            resp = requests.get(url=url, headers=headers, params=data, timeout=timeout, verify=verify)
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers, verify=verify)
        elif method == "POST":
            resp = requests.post(url=url, headers=headers, json=data, verify=verify)
        elif method == "DELETE":
            resp = requests.delete(url=url, headers=headers, json=data, verify=verify)
        elif method == "PUT":
            resp = requests.put(url=url, headers=headers, json=data, verify=verify)
        else:
            return False, {"msg": "method not supported"}
    except requests.exceptions.RequestException, e:
        logger.exception("engine http request error! type: %s, url: %s, data: %s" % (method, url, str(data)))
        return False, {"msg": str(e)}
    else:
        if resp.status_code != 200:
            _content = _get_content(method, url, data, resp)
            return False, _content
        return True, resp.json()


def http_get(url, data):
    headers = _gen_header()
    return _http_request(method="GET", url=url, headers=headers, data=data)


def http_post(url, data):
    headers = _gen_header()
    return _http_request(method="POST", url=url, headers=headers, data=data)


def http_delete(url, data):
    headers = _gen_header()
    return _http_request(method="DELETE", url=url, headers=headers, data=data)


def engine_http_get(app_code, auth_token, url, params):
    headers = _gen_engine_header(app_code, auth_token)
    return _http_request(method="GET", url=url, headers=headers, data=params)


def engine_http_post(app_code, auth_token, url, data):
    headers = _gen_engine_header(app_code, auth_token)
    return _http_request(method="POST", url=url, headers=headers, data=data)


def engine_http_delete(app_code, auth_token, url, data):
    headers = _gen_engine_header(app_code, auth_token)
    return _http_request(method="DELETE", url=url, headers=headers, data=data)
