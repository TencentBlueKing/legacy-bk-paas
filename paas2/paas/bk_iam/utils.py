# -*- coding: utf-8 -*-


from django.http import JsonResponse

from bk_iam.signals import _app_creator_permission


class FailJsonResponse(JsonResponse):
    def __init__(self, code, message, **kwargs):
        data = {}
        if kwargs:
            data.update(kwargs)

        # high priority
        data.update({"code": code, "message": message, "data": {}})

        super(FailJsonResponse, self).__init__(data)


class OKJsonResponse(JsonResponse):
    def __init__(self, data, **kwargs):
        body = {}
        if kwargs:
            body.update(kwargs)

        # high priority
        body.update({"code": 0, "message": "ok", "data": data})

        super(OKJsonResponse, self).__init__(body)


def apply_app_creator_permission(app_code, app_name, username):
    data = {
        "app_code": app_code,
        "app_name": app_name,
        "username": username,
    }
    _app_creator_permission.send(sender="open_paas", **data)
