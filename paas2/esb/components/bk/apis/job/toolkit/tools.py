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

from common.log import logger
from . import configs


class JOBClient(object):
    def __init__(self, http_client, host=None):
        self.http_client = http_client

    def post(self, host, data=None):
        # 配置项是否开启SSL
        if configs.USE_SSL is True:
            response = self.http_client.post(
                host,
                configs.JOB_API_ACTION_URL,
                data=data,
                verify=False,
                cert=(configs.CLIENT_CERT, configs.CLIENT_KEY),
            )
        else:
            response = self.http_client.post(host, configs.JOB_API_ACTION_URL, data=data)

        try:
            if response["resultCode"] == "0000":
                return {"result": True, "data": response["result"]}
            else:
                result = {"result": False, "message": response["errMsg"]}
                if "errMsgExt" in response:
                    result["message_ext"] = response["errMsgExt"]
                return result
        except Exception:
            logger.exception("response: %s", json.dumps(response))
            return {
                "result": False,
                "message": "Job system interface results in an unknown format, "
                "please contact the component developer to handle it.",
            }


def get_basic_json(action, params={}):
    request = {
        "action": action,
        "parms": params,
    }
    return json.dumps(request)
