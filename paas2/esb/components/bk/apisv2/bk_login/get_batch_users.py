# -*- coding: utf-8 -*-
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetBatchUsers(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"批量获取用户信息"
    label_en = "get users"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_username_list = ListField(label="username list", required=True)

    def handle(self):
        result = self.invoke_other("generic.v2.usermanage.get_batch_users", kwargs=self.form_data)
        for username, user in (result["data"] or {}).items():
            result["data"][username] = tools.convert_user_info(user)
        self.response.payload = result
