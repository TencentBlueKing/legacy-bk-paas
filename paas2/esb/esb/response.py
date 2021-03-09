# -*- coding: utf-8 -*-


class CompResponse(object):
    """
    Response class for Component
    """

    def __init__(self):
        self.payload = {}
        self.headers = {}

    def get_payload(self):
        return self.payload


def format_resp_dict(resp_data):
    """
    根据给定的数据生成一个标准的HttpResponse数据
    """
    resp_data.setdefault("result", False)
    resp_data.setdefault("data", None)
    resp_data.setdefault("message", "")
    resp_data.setdefault("code", 0 if resp_data["result"] else 1306000)
    return resp_data
