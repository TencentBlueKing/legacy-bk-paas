# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetAllUsers(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取所有用户信息"
    label_en = "get all users"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label="login token", required=False)
        bk_role = forms.IntegerField(label="user role", required=False)

    def handle(self):
        result = self.invoke_other("generic.v2.usermanage.get_all_users", kwargs=self.form_data)
        result["data"] = map(tools.convert_user_info, result["data"] or [])
        self.response.payload = result
