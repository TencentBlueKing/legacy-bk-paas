# -*- coding: utf-8 -*-
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component

from .toolkit import configs


class GetCicdkitNginx(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取后台域名"
    label_en = "get cicdkit nginx"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    def handle(self):
        self.response.payload = self.outgoing.http_client.get(
            self.host,
            "/api/v1/getCicdkitNginx",
        )
