# -*- coding: utf-8 -*-
import json

from django import forms

from components.component import Component
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class EditApp(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"编辑轻应用"
    label_en = "edit application"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_light_app_code = forms.CharField(label="bk light app code", required=True)
        bk_light_app_name = forms.CharField(label="bk light app name", required=False)
        app_url = forms.CharField(label="app url", required=False)
        developer = ListField(label="developer", required=False)
        app_tag = forms.CharField(label="app tag", required=False)
        introduction = forms.CharField(label="introduction", required=False)
        width = forms.IntegerField(label="width", required=False)
        height = forms.IntegerField(label="height", required=False)

        def clean(self):
            param_keys = [
                "bk_light_app_code",
                "bk_light_app_name",
                "app_url",
                "developer",
                "app_tag",
                "introduction",
                "width",
                "height",
            ]
            params = self.get_cleaned_data_when_exist(param_keys)
            if "developer" in params:
                params["developer"] = ";".join(params["developer"])
            return params

    def handle(self):
        self.form_data["operator"] = self.current_user.username

        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=self.host, path="/paas/api/v2/edit_app/", data=json.dumps(self.form_data)
        )
