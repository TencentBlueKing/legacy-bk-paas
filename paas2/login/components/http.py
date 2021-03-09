# -*- coding: utf-8 -*-
"""
all new components should use the http.py here!
"""

from __future__ import unicode_literals

import requests

from common.log import logger


def _gen_header():
    headers = {
        "Content-Type": "application/json",
    }
    return headers


def _http_request(method, url, headers=None, data=None, timeout=None, verify=False, cert=None, cookies=None):
    try:
        if method == "GET":
            resp = requests.get(
                url=url, headers=headers, params=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
            )
        elif method == "HEAD":
            resp = requests.head(url=url, headers=headers, verify=verify, cert=cert, cookies=cookies)
        elif method == "POST":
            resp = requests.post(
                url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
            )
        elif method == "DELETE":
            resp = requests.delete(
                url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
            )
        elif method == "PUT":
            resp = requests.put(
                url=url, headers=headers, json=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
            )
        else:
            return False, None
    except requests.exceptions.RequestException:
        logger.exception("http request error! method: %s, url: %s, data: %s", method, url, data)
        return False, None
    else:
        if resp.status_code != 200:
            content = resp.content[:100] if resp.content else ""
            error_msg = "http request fail! method: %s, url: %s, " "response_status_code: %s, response_content: %s"
            # if isinstance(content, str):
            #     try:
            #         content = content.decode('utf-8')
            #     except Exception:
            #         content = content
            logger.error(error_msg, method, url, resp.status_code, content)
            return False, None

        return True, resp.json()


def http_get(url, data, headers=None, verify=False, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(
        method="GET", url=url, headers=headers, data=data, verify=verify, cert=cert, timeout=timeout, cookies=cookies
    )


def http_post(url, data, headers=None, verify=False, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(
        method="POST", url=url, headers=headers, data=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
    )


def http_put(url, data, headers=None, verify=False, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(
        method="PUT", url=url, headers=headers, data=data, timeout=timeout, verify=verify, cert=cert, cookies=cookies
    )


def http_delete(url, data, headers=None, verify=False, cert=None, timeout=None, cookies=None):
    if not headers:
        headers = _gen_header()
    return _http_request(
        method="DELETE",
        url=url,
        headers=headers,
        data=data,
        timeout=timeout,
        verify=verify,
        cert=cert,
        cookies=cookies,
    )
