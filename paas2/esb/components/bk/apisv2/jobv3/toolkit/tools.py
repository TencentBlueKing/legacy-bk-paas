# -*- coding: utf-8 -*-
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
