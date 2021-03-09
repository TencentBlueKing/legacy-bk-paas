# -*- coding: utf-8 -*-
import json

from django import forms

from components.component import Component
from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class ModifyAppLogo(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"修改轻应用 logo"
    label_en = "modify application logo"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_light_app_code = forms.CharField(label="bk light app code", required=True)
        logo = forms.CharField(label="logo", required=True)

    def handle(self):
        self.form_data["operator"] = self.current_user.username

        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=self.host, path="/paas/api/v2/modify_app_logo/", data=json.dumps(self.form_data)
        )
