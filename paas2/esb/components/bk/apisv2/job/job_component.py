# -*- coding: utf-8 -*-
import json

from common.constants import API_TYPE_OP
from components.component import ConfComponent

from .toolkit import configs


class JobComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    def handle(self):
        request_info = self.get_request_info(
            extra_params={
                "bk_username": self.current_user.username,
                "bk_app_code": self.request.app_code,
            }
        )

        if self.dest_http_method == "GET":
            data = json.dumps(request_info["params"])
        else:
            data = request_info["data"]

        self.response.payload = self.outgoing.http_client.post(
            host=self.host,
            path=request_info["path"],
            data=data,
            verify=True,
            response_encoding="utf-8",
            with_jwt_header=True,
            cert=(configs.CLIENT_CERT, configs.CLIENT_KEY),
            headers={
                "Bk-Username": self.current_user.username,
                "Bk-App-Code": self.request.app_code,
                "X-Bkapi-Request-Id": self.request.request_id,
                "Blueking-Language": self.request.bk_language,
                "Content-Type": "application/json",
            },
        )
