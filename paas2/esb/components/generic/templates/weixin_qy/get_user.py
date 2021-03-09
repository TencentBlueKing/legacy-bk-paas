# -*- coding: utf-8 -*-
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from .toolkit import tools, configs


class GetUser(Component, SetupConfMixin):
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        corpid = forms.CharField(label="corp ID", required=True)
        corpsecret = forms.CharField(label="corp secret", required=True)
        userid = forms.CharField(label="userid", required=True)

    def get_wx_access_token(self, params):
        wx_token = self.invoke_other("generic.weixin_qy.get_token", kwargs=params)
        return wx_token["data"]["access_token"]

    def handle(self):
        client = tools.WEIXINClient(self.outgoing.http_client)
        access_token = self.get_wx_access_token(self.form_data)
        result = client.get(
            path="/cgi-bin/user/get", params={"access_token": access_token, "userid": self.form_data["userid"]}
        )
        self.response.payload = result
