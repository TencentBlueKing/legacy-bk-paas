# -*- coding: utf-8 -*-
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
