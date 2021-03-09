# -*- coding: utf-8 -*-
from common.errors import error_codes
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import configs


class ApprovalComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        request_info = self.get_request_info()

        response = self.outgoing.http_client.request(
            self.dest_http_method,
            host=configs.host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
            response_encoding="utf-8",
            headers={
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
                "Content-Type": "application/json",
            },
        )
        try:
            self.response.payload = {
                "result": response["result"],
                "code": response["bk_error_code"],
                "message": response.get("bk_error_msg", ""),
                "data": response.get("data"),
                "permission": response.get("permission"),
            }
        except Exception:
            raise error_codes.THIRD_PARTY_RESULT_ERROR.format_prompt(args=configs.SYSTEM_NAME)
