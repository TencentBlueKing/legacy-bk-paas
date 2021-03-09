# -*- coding: utf-8 -*-
import json

from django import forms

from components.component import Component
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class CreateApp(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"创建轻应用"
    label_en = "create application"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_light_app_name = forms.CharField(label="bk light app name", required=True)
        app_url = forms.CharField(label="app url", required=True)
        developer = ListField(label="developer", required=True)
        app_tag = forms.CharField(label="app tag", required=False)
        introduction = forms.CharField(label="introduction", required=False)
        width = forms.IntegerField(label="width", required=False)
        height = forms.IntegerField(label="height", required=False)

        def clean(self):
            param_keys = ["bk_light_app_name", "app_url", "developer", "app_tag", "introduction", "width", "height"]
            params = self.get_cleaned_data_when_exist(param_keys)
            params["developer"] = ";".join(params["developer"])
            return params

    def handle(self):
        self.form_data["creator"] = self.current_user.username
        self.form_data["bk_app_code"] = self.request.app_code

        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=self.host, path="/paas/api/v2/create_app/", data=json.dumps(self.form_data)
        )
