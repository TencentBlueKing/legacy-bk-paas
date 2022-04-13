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
from __future__ import print_function

from builtins import str
from django.conf import settings

from components.http import http_get


BK_PAAS_HOST = "%s://%s" % ("http", settings.PAAS_INNER_DOMAIN)
APP_CODE = settings.PAAS_APP_ID
# # SECRET_KEY from settings_*.py, production is __ESB_TOKEN__
APP_SECRET = settings.ESB_TOKEN


# FIXME: move into usermgr_api.py

def _call_esb_api(http_func, path, data, bk_token, bk_username, timeout=None):
    headers = {}
    data.update(
        {
            "bk_app_code": APP_CODE,
            "bk_app_secret": APP_SECRET,
            "bk_token": bk_token,
            "bk_username": bk_username,
        }
    )
    url = "{host}{path}".format(host=BK_PAAS_HOST, path=path)

    ok, _data = http_func(url, data, headers=headers, timeout=timeout)

    if not ok:
        return False, "_call_esb_api fail", None

    if _data.get("code") != 0:
        return False, _data.get("message", "esb api fail"), None

    _d = _data.get("data")

    return True, "ok", _d


def fetch_user_names(user_ids):
    path = "/api/c/compapi/v2/usermanage/list_users/"
    params = {
        "no_page": True,
        "lookup_field": "id",
        "exact_lookups": ",".join([str(i) for i in user_ids]),
        "fields": "id,username",
    }
    ok, message, data = _call_esb_api(http_get, path, params, bk_token=None, bk_username="paas")
    if not ok:
        return False, None

    user_names = {str(i["id"]): i["username"] for i in data}
    return True, user_names


def fetch_department_names(department_ids):
    path = "/api/c/compapi/v2/usermanage/list_departments/"
    params = {
        "no_page": True,
        "lookup_field": "id",
        "exact_lookups": ",".join([str(i) for i in department_ids]),
        "fields": "id,name",
    }
    ok, message, data = _call_esb_api(http_get, path, params, bk_token=None, bk_username="paas")
    if not ok:
        return False, None

    department_names = {str(i["id"]): i["name"] for i in data}
    return True, department_names


if __name__ == "__main__":
    a = fetch_user_names([1, 42422])
    print(a)
    b = fetch_department_names([86477, 44487])
    print(b)
