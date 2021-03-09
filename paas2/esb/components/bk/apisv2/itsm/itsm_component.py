# -*- coding: utf-8 -*-
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import configs


class ItsmComponent(ConfComponent):

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
            headers=request_info["headers"],
            with_jwt_header=True,
        )
        self.response.payload = response
