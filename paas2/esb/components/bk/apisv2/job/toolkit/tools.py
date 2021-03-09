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

from common.log import logger
from common.bkerrors import bk_error_codes
from . import configs


class JOBClient(object):
    def __init__(self, http_client, host=None):
        self.http_client = http_client

    def post(self, host, path, data=None, bk_language="en"):
        response = self.http_client.post(
            host,
            path,
            data=data,
            verify=False,
            response_encoding="utf-8",
            cert=(configs.CLIENT_CERT, configs.CLIENT_KEY),
        )

        try:
            if response["bk_error_code"] == 0:
                return {
                    "result": True,
                    "code": response["bk_error_code"],
                    "data": response.get("data", None),
                    "message": self.get_resp_message(response["bk_error_msg"], bk_language),
                    "permission": response.get("permission"),
                }
            else:
                return {
                    "result": False,
                    "code": response["bk_error_code"],
                    "message": self.get_resp_message(response["bk_error_msg"], bk_language),
                    "permission": response.get("permission"),
                }
        except Exception:
            logger.exception("response: %s", json.dumps(response))
            return {
                "result": False,
                "code": bk_error_codes.REQUEST_JOB_ERROR.code,
                "message": "Job system interface results in an unknown format, "
                "please contact the component developer to handle it.",
            }

    def get_resp_message(self, message, bk_language):
        if bk_language == "all":
            return message
        else:
            return message.get(bk_language, message["en"])


def get_action_params(action, params, operator, app_code, request_id):
    params.update(
        {
            "action": action,
            "operator": operator,
            "bk_app_code": app_code,
            "request_id": request_id,
        }
    )
    return json.dumps(params)
