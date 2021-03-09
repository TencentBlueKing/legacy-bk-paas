# -*- coding: utf-8 -*-
from . import configs


class PAASClient(object):
    def __init__(self, http_client):
        self.http_client = http_client

    def request(self, method, host, path, data=None, params=None):
        result = self.http_client.request(
            method=method,
            host=host,
            path=path,
            data=data,
            params=params,
            headers=configs.headers,
        )
        return self.format_result(result)

    def post(self, host, path, data=None):
        return self.request(method="POST", host=host, path=path, data=data)

    def get(self, host, path, params=None):
        return self.request(method="GET", host=host, path=path, params=params)

    def format_result(self, result):
        if result["bk_error_code"] == 0:
            return {
                "result": True,
                "code": 0,
                "data": result["data"],
                "message": result.get("bk_error_msg", ""),
                "permission": result.get("permission"),
            }

        return {
            "result": False,
            "code": result["bk_error_code"],
            "data": result.get("data", None),
            "message": result["bk_error_msg"],
            "permission": result.get("permission"),
        }
