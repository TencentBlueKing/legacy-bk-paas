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

import json
import time
import base64
import hashlib
import hmac
import random

import requests

TEST_APP_CODE = "gcloud"
TEST_APP_TOKEN = "ea2f8a3e-b808-4b60-866b-522d90f659cc"

BASE_HOST = "dev.paas.open.blueking.com:8000"
BASE_URL = "http://dev.paas.open.blueking.com:8000"

# 创建APP
CREATE_APP_PATH = "/paas/api/app_maker/app/create/"
CREATE_APP_URL = "%s%s" % (BASE_URL, CREATE_APP_PATH)
# 修改APP
EDIT_APP_PATH = "/paas/api/app_maker/app/edit/"
EDIT_APP_URL = "%s%s" % (BASE_URL, EDIT_APP_PATH)
# 删除APP
DEL_APP_PATH = "/paas/api/app_maker/app/del/"
DEL_APP_URL = "%s%s" % (BASE_URL, DEL_APP_PATH)


def compute_signature(method, host, url, params, secret_key):
    """
    生成签名
    """
    params = "&".join(["%s=%s" % (i, params[i]) for i in sorted(params)])
    message = "%s%s%s?%s" % (method, host, url, params)
    digest_make = hmac.new(str(secret_key), str(message), hashlib.sha1).digest()
    _signature = base64.b64encode(digest_make)
    return _signature


def create_maker_app(creator, app_name, app_url, developer):
    """
    创建应用测试
    """
    # 签名
    app_code = TEST_APP_CODE
    app_secret = TEST_APP_TOKEN
    nonce = random.randint(1, 100000)
    timestamp = str(int(time.time()))
    data = {"creator": creator, "app_name": app_name, "app_url": app_url, "developer": developer}
    data = json.dumps(data)
    params = {"app_code": app_code, "Nonce": nonce, "Timestamp": timestamp, "Data": data}
    signature = compute_signature("POST", BASE_HOST, CREATE_APP_PATH, params, app_secret)
    params["Signature"] = signature
    params.pop("Data", None)
    result = requests.post(CREATE_APP_URL, params=params, data=data)
    print result
    print result.content
    return result


def edit_maker_app(operator, app_maker_code, app_name="", app_url="", developer=""):
    """
    编辑应用测试
    """
    # 签名
    app_code = TEST_APP_CODE
    app_secret = TEST_APP_TOKEN
    nonce = random.randint(1, 100000)
    timestamp = str(int(time.time()))
    data = {
        "operator": operator,
        "app_name": app_name,
        "app_url": app_url,
        "developer": developer,
        "app_maker_code": app_maker_code,
    }
    data = json.dumps(data)
    params = {"app_code": app_code, "Nonce": nonce, "Timestamp": timestamp, "Data": data}
    signature = compute_signature("POST", BASE_HOST, EDIT_APP_PATH, params, app_secret)
    params["Signature"] = signature
    params.pop("Data", None)
    result = requests.post(EDIT_APP_URL, params=params, data=data)
    print result
    print result.content
    return result


def del_maker_app(operator, app_maker_code):
    """
    下架应用测试
    """
    # 签名
    app_code = TEST_APP_CODE
    app_secret = TEST_APP_TOKEN
    nonce = random.randint(1, 100000)
    timestamp = str(int(time.time()))
    data = {"operator": operator, "app_maker_code": app_maker_code}
    data = json.dumps(data)
    params = {"app_code": app_code, "Nonce": nonce, "Timestamp": timestamp, "Data": data}
    signature = compute_signature("POST", BASE_HOST, DEL_APP_PATH, params, app_secret)
    params["Signature"] = signature
    params.pop("Data", None)
    result = requests.post(DEL_APP_URL, params=params, data=data)
    print result
    print result.content
    return result


if __name__ == "__main__":
    create_maker_app("admin", "testlapp", "http://dev.paas.open.blueking.com:8000/o/testlapp/", "admin")
    edit_maker_app("admin", "gcloud_ze4e4e1ke", "testlapp2", "", "")
    del_maker_app("admin", "gcloud_ze4e4e1ke")
