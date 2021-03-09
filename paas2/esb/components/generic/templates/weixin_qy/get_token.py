# -*- coding: utf-8 -*-
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetToken(Component, SetupConfMixin):
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        corpid = forms.CharField(label="corp ID", required=True)
        corpsecret = forms.CharField(label="corp secret", required=True)

    def handle(self):
        client = tools.WEIXINClient(self.outgoing.http_client)
        result = client.get(path="/cgi-bin/gettoken", params=self.form_data)
        self.response.payload = result
