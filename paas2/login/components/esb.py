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

from __future__ import unicode_literals

import copy

from django.conf import settings
from common.log import logger

def _call_esb_api(http_func, url_path, data, timeout=30):
    # 默认请求头
    headers = {
        "Content-Type": "application/json",
    }

    # Note: 目前企业版ESB调用的鉴权信息都是与接口的参数一起的，并非在header头里
    common_params = {
        "bk_app_code": "bk_paas",
        "bk_app_secret": settings.ESB_TOKEN,
        "bk_username": "admin",  # 存在后台任务，无法使用登录态的方式
        # 兼容TE版
        "app_code": "bk_paas",
        "app_secret": settings.ESB_TOKEN,
    }
    data.update(common_params)

    url = "http://{}{}".format(settings.PAAS_INNER_DOMAIN, url_path)

    ok, resp_data = http_func(url, data, headers=headers)
    if not ok:
        message = resp_data["error"]
        logger.error(
            "call esb api failed! %s %s, data: %s, error: %s",
            http_func.__name__,
            url,
            _remove_sensitive_info(data),
            message,
        )
        return False, -1, message, None

    code = resp_data.get("code", -1)
    message = resp_data.get("message", "unknown")
    _data = resp_data.get("data", {})

    # code may be string or int, and login v1 the code is "00"
    try:
        code = int(code)
    except Exception:  # pylint: disable=broad-except
        pass
    if code in ("0", 0, "00"):
        return True, 0, "ok", resp_data["data"]

    logger.error(
        "call esb api error! %s %s, data: %s, code: %s, message: %s",
        http_func.__name__,
        url,
        _remove_sensitive_info(data),
        code,
        message,
    )

    return False, code, message, _data


def _remove_sensitive_info(info):
    """
    去除敏感信息
    """
    if info is None:
        return ""

    data = copy.copy(info)
    sensitive_info_keys = ["bk_token", "bk_app_secret", "app_secret", "password"]

    for key in sensitive_info_keys:
        if key in data:
            data[key] = data[key][:3] + "******"
    return str(data)