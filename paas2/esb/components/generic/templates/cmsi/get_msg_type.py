# -*- coding: utf-8 -*-
from components.component import Component, SetupConfMixin
from common.constants import API_TYPE_Q, HTTP_METHOD
from common.base_utils import str_bool
from .toolkit import configs


class GetMsgType(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.GET
    label = u"查询消息发送类型"
    label_en = "Get message type"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        bk_language = self.request.headers.get("Blueking-Language", "en")

        msg_type = []
        for mt in configs.msg_type:
            is_active = mt.get("is_active", str_bool(getattr(self, mt["type"], False)))
            msg_type.append(
                {
                    "type": mt["type"],
                    "icon": mt["active_icon"] if is_active else mt["unactive_icon"],
                    "label": mt["label_en"] if bk_language == "en" else mt["label"],
                    "is_active": is_active,
                }
            )

        self.response.payload = {
            "result": True,
            "data": msg_type,
        }
