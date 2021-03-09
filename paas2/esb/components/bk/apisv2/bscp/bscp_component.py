# -*- coding: utf-8 -*-
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import configs


class BscpComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        request_info = self.get_request_info()

        self.response.payload = self.outgoing.http_client.request(
            self.dest_http_method,
            host=configs.host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
            with_jwt_header=True,
            allow_non_200=True,
            response_encoding="utf-8",
            headers={
                "X-Bkapi-User-Name": self.current_user.username,
                "X-Bkapi-App-Code": self.request.app_code,
            },
        )
