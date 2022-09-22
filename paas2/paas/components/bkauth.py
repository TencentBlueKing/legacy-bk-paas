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

from django.conf import settings

from common.log import logger
from .esb import _remove_sensitive_info
from .http import http_post

HOST_BKAUTH = ""
try:
    HOST_BKAUTH =  settings.HOST_BKAUTH
    if not HOST_BKAUTH.startswith("http"):
        HOST_BKAUTH = "http://" + HOST_BKAUTH
    print("got bkauth host: {}".format(HOST_BKAUTH))
except:
    pass


def _call_bkauth_api(http_func, url_path, data, timeout=30):
    # 默认请求头
    headers = {
        "Content-Type": "application/json",
        "X-Bk-App-Code": "bk_paas",
        "X-Bk-App-Secret": settings.ESB_TOKEN,
    }

    url = "{}{}".format(HOST_BKAUTH, url_path)

    ok, resp_data = http_func(url, data, headers=headers)
    if not ok:
        message = resp_data["error"]
        logger.error(
            "call bkauth api failed! %s %s, data: %s, error: %s",
            http_func.__name__,
            url,
            _remove_sensitive_info(data),
            message,
        )
        return False, -1, message, None

    code = resp_data.get("code", -1)
    message = resp_data.get("message", "unknown")

    # code may be string or int, and login v1 the code is "00"
    try:
        code = int(code)
    except Exception:  # pylint: disable=broad-except
        pass
    if code in ("0", 0, "00"):
        return True, 0, "ok", resp_data["data"]

    logger.error(
        "call bkauth api error! %s %s, data: %s, code: %s, message: %s",
        http_func.__name__,
        url,
        _remove_sensitive_info(data),
        code,
        message,
    )

    return False, code, message, None


def create_app(app_code, app_secret, app_name):
    if not HOST_BKAUTH:
        logger.info("bkauth host not set, skip create app sync data to bkauth")
        return

    path = "/api/v1/apps"
    data = {
        "bk_app_code": app_code,
        "bk_app_secret": app_secret,
        "name": app_name,
    }
    ok, code, message, data = _call_bkauth_api(http_post, path, data)

    logger.info(
        "sync app_code/app_secret to bkauth result: app_code=%s, app_name=%s, ok=%s, code=%s, message=%s, data=%s",
        app_code, app_name, ok, code, message, data,
    )
    return ok
