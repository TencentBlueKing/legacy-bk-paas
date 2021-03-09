# -*- coding: utf-8 -*-
from common.errors import error_codes
from common.constants import API_TYPE_OP
from components.component import ConfComponent
from .toolkit import tools, configs


class CcComponent(ConfComponent):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    def handle(self):
        request_info = self.get_request_info()

        client = tools.CCClient(self)
        request_handler = getattr(client, self.dest_http_method.lower(), None)
        if not request_handler:
            raise error_codes.REQEUST_DEST_METHOD_ERROR.format_prompt(self.dest_http_method.upper())
        self.response.payload = request_handler(
            host=self.host,
            path=request_info["path"],
            params=request_info["params"],
            data=request_info["data"],
        )
