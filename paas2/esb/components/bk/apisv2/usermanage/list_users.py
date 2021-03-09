# -*- coding: utf-8 -*-
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component, SetupConfMixin
from .toolkit import configs


class ListUsers(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.GET
    label = u"查询用户"
    label_en = "list users"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs=self.request.kwargs,
        )
        comp_obj.setup_conf(
            {
                "name": "list_users",
                "dest_path": "/api/v2/profiles/",
                "dest_http_method": "GET",
            }
        )
        self.response.payload = comp_obj.invoke()
