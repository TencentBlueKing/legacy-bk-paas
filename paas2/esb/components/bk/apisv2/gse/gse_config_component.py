# -*- coding: utf-8 -*-
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import configs


class GseConfigComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        request_info = self.get_request_info()

        response = self.outgoing.http_client.request(
            self.dest_http_method,
            host=configs.gse_config_host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
            with_jwt_header=True,
            response_encoding="utf-8",
            headers={
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
            },
        )

        response.setdefault("code", response.pop("bk_error_code", 1306000))
        response.setdefault("message", response.pop("bk_error_msg", "unknown error"))

        self.response.payload = response
