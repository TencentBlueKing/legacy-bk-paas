# -*- coding: utf-8 -*-
from common.constants import API_TYPE_Q
from components.component import ConfComponent
from .toolkit import configs


class UsermanageComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

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
            },
        )

        self.response.payload = response
