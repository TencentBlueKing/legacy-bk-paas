# -*- coding: utf-8 -*-


def ok_resp(code="1306000", message="OK", data={}):
    return {
        "ok": True,
        "code": code,
        "message": message,
        "data": data,
    }


def failed_resp(code="1306000", message="error", data={}):
    return {
        "ok": False,
        "code": code,
        "message": message,
        "data": data,
    }
