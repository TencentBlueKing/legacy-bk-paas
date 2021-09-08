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

from builtins import object
import json
import random
import time
import hashlib

from django.utils.encoding import force_bytes

from . import configs


class QCloudSmsClient(object):
    def __init__(self, http_client):
        self.http_client = http_client

    def get_random(self):
        return random.randint(100000, 999999)

    def get_cur_time(self):
        return int(time.time())

    def calculate_sig(self, app_key, rnd, cur_time, mobiles):
        text = "appkey=%s&random=%s&time=%s&mobile=%s" % (app_key, rnd, cur_time, ",".join(mobiles))
        return hashlib.sha256(force_bytes(text)).hexdigest()

    def post(self, path, data):
        result = self.http_client.post(configs.host, path, data=json.dumps(data))
        if result.get("ErrorCode"):
            return {
                "result": False,
                "message": result.get("ErrorInfo", u"An unknown error has occurred"),
                "data": result,
            }
        if result["result"] == 0:
            return {
                "result": True,
                "data": result,
                "message": result["errmsg"],
            }
        else:
            return {
                "result": False,
                "data": result,
                "message": result["errmsg"],
            }
