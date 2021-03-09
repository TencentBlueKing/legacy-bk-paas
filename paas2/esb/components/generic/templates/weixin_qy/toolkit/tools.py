# -*- coding: utf-8 -*-
from . import configs


class WEIXINClient(object):
    def __init__(self, http_client):
        self.http_client = http_client

    def request(self, method, path, params=None, data=None):
        result = self.http_client.request(method, host=configs.host, path=path, params=params, data=data)
        try:
            err_code = result.get("errcode")
        except Exception:
            return {
                "result": False,
                "message": "An exception occurred while requesting business WeChat service, "
                "please contact the component developer to handle it.",
            }
        if err_code in (None, 0):
            return {"result": True, "data": result}
        else:
            return {"result": False, "message": result["errmsg"], "data": result}

    def post(self, *args, **kwargs):
        return self.request("POST", *args, **kwargs)

    def get(self, *args, **kwargs):
        return self.request("GET", *args, **kwargs)
