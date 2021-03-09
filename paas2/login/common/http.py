# -*- coding: utf-8 -*-
"""
请求登录的http基础方法

Rules:
1. POST/DELETE/PUT: json in - json out, 如果resp.json报错, 则是登录接口问题
2. GET带参数 HEAD不带参数
3. 以统一的header头发送请求

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from __future__ import unicode_literals

import requests

from common.log import logger


def _gen_header():
    headers = {
        "Content-Type": "application/json",
    }
    return headers


def _http_request(method, url, headers=None, data=None, timeout=None, verify=False, cert=None):
    try:
        if method == "GET":
            resp = requests.get(url=url, headers=headers, params=data, timeout=timeout, verify=verify, cert=cert)
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers, verify=verify, cert=cert)
        elif method == "POST":
            resp = requests.post(url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert)
        elif method == "DELETE":
            resp = requests.delete(url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert)
        elif method == "PUT":
            resp = requests.put(url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert)
        else:
            return False, None
    except requests.exceptions.RequestException:
        logger.exception("http request error! method: %s, url: %s" % (method, url))
        return False, None
    else:
        if resp.status_code != 200:
            content = resp.content[:100] if resp.content else ""
            error_msg = "http request fail! method: %s, url: %s, " "response_status_code: %s, response_content: %s"
            logger.error(error_msg % (method, url, resp.status_code, content))
            return False, None

        return True, resp.json()


def http_get(url, data, verify=False, cert=None, timeout=None):
    headers = _gen_header()
    return _http_request(method="GET", url=url, headers=headers, data=data, verify=verify, cert=cert, timeout=timeout)


def http_post(url, data, verify=False, cert=None, timeout=None):
    headers = _gen_header()
    return _http_request(method="POST", url=url, headers=headers, data=data, verify=verify, cert=cert, timeout=timeout)


def http_delete(url, data, verify=False, cert=None, timeout=None):
    headers = _gen_header()
    return _http_request(
        method="DELETE", url=url, headers=headers, data=data, verify=verify, cert=cert, timeout=timeout
    )
