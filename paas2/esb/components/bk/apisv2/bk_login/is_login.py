# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class IsLogin(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"用户登录态验证"
    label_en = "check is login"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label="login token", required=True)

    def handle(self):
        client = tools.LOGINClient(self.outgoing.http_client)
        self.response.payload = client.get(
            host=configs.host,
            path="/login/api/v2/is_login/",
            params=self.form_data,
        )
