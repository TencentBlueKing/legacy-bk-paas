# -*- coding: utf-8 -*-
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component

from .toolkit import configs


class CallbackProtocol(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"作业类回调报文描述"
    label_en = "Callback post data description"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    def handle(self):
        self.response.payload = {
            "result": False,
            "message": "This is a fake component that only provides documentation",
        }
