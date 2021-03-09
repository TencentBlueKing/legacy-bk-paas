#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
请求app engine的底层方法

Rules:
1. POST/DELETE/PUT: json in - json out, 如果resp.json报错, 则是engine接口问题
2. GET带参数 HEAD不带参数
3. 以统一的header头发送请求

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
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
