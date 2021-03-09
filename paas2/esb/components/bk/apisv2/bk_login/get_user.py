# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetUser(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取用户信息"
    label_en = "get user"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label="login token", required=False)
        bk_username = forms.CharField(label="username", required=False)

    def handle(self):
        client = tools.LOGINClient(self.outgoing.http_client)
        self.response.payload = client.get(
            host=configs.host,
            path="/login/api/v2/get_user/",
            params=self.form_data,
        )
