# -*- coding: utf-8 -*-
import copy
import json

from common.errors import CommonAPIError

from . import configs


class CCClient(object):
    def __init__(self, component):
        self.http_client = component.outgoing.http_client

        self.bk_username = component.current_user.username
        self.bk_app_code = component.request.app_code

        self.bk_language = component.request.bk_language
        self.bk_supplier_account = (
            component.request.kwargs.get("bk_supplier_account") or configs.DEFAULT_BK_SUPPLIER_ACCOUNT
        )

    def request(self, method, host, path, params=None, data=None, headers={}, **kwargs):
        headers = copy.copy(headers)
        headers.update(
            {
                "Bk-Username": self.bk_username,
                "Bk-App-Code": self.bk_app_code,
                "BK_USER": self.bk_username,
                "HTTP_BLUEKING_LANGUAGE": self.bk_language,
                "HTTP_BK_SUPPLIER_ACCOUNT": self.bk_supplier_account,
                "HTTP_BLUEKING_SUPPLIER_ID": "0",
            }
        )
        return self.http_client.request(
            method,
            host,
            path,
            params=params,
            data=data,
            headers=headers,
            allow_non_200=True,
            response_encoding="utf-8",
            response_type="text",
            **kwargs
        )

    def get(self, host, path, params=None, headers={}, **kwargs):
        response = self.request("GET", host, path, params=params, headers=headers, **kwargs)
        return self.format_response(response)

    def post(self, host, path, data=None, headers={}, **kwargs):
        response = self.request("POST", host, path, data=data, headers=headers, **kwargs)
        return self.format_response(response)

    def put(self, host, path, data=None, headers={}, **kwargs):
        response = self.request("PUT", host, path, data=data, headers=headers, **kwargs)
        return self.format_response(response)

    def delete(self, host, path, data=None, headers={}, **kwargs):
        response = self.request("DELETE", host, path, data=data, headers=headers, **kwargs)
        return self.format_response(response)

    def format_response(self, response):
        try:
            response = json.loads(response)
        except Exception:
            return {
                "result": False,
                "code": 1306000,
                "message": "Request interface error, the response content is not a json string: %s" % response,
            }

        bk_error_code = response.get("bk_error_code", response.get("code"))
        if bk_error_code is None:
            raise CommonAPIError(
                "An error occurred while requesting CC interface, " "the response content does not contain code field."
            )
        elif bk_error_code == 0:
            return {
                "result": True,
                "code": 0,
                "data": response.get("data"),
                "message": response.get("bk_error_msg", response.get("message")) or "",
                "permission": response.get("permission"),
            }
        else:
            return {
                "result": False,
                "code": bk_error_code,
                "data": response.get("data"),
                "message": response.get("bk_error_msg", response.get("message")) or "",
                "permission": response.get("permission"),
            }
