# -*- coding: utf-8 -*-
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs


class GetAllUsers(Component):
    """
    apiLabel 获取所有用户信息
    apiMethod GET
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        comp_obj = self.prepare_other(
            "generic.v2.usermanage.usermanage_component",
            kwargs=self.request.kwargs,
        )
        comp_obj.setup_conf(
            {
                "dest_path": "/api/v1/profile_list/",
                "dest_http_method": "GET",
            }
        )
        self.response.payload = comp_obj.invoke()
