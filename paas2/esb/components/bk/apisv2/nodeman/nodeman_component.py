# -*- coding: utf-8 -*-
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import configs


class NodemanComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        request_info = self.get_request_info()

        if self.dest_http_method == "GET":
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
        else:
            headers = {"Content-Type": "application/json"}
        headers.update(
            {
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
            }
        )

        response = self.outgoing.http_client.request(
            self.dest_http_method,
            host=configs.host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
            with_jwt_header=True,
            headers=headers,
            response_encoding="utf-8",
        )
        self.response.payload = response
