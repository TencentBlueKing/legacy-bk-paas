# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component

from .toolkit import tools, configs


class GetScriptList(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"查询脚本列表"
    label_en = "Get Script List"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=False)
        is_public = forms.BooleanField(label="is public", required=False)
        return_script_content = forms.BooleanField(label="return script content", required=False)
        script_type = forms.IntegerField(label="script type", required=False)
        script_name = forms.CharField(label="job name", required=False)
        start = forms.IntegerField(label="start", required=False)
        length = forms.IntegerField(label="length", required=False)

        def clean(self):
            params_keys = [
                "is_public",
                "return_script_content",
                "script_type",
                "script_name",
                "start",
                "length",
            ]
            params = self.get_cleaned_data_when_exist(keys=["bk_biz_id"])
            params["params"] = self.get_cleaned_data_when_exist(keys=params_keys)
            return params

    def handle(self):
        params = tools.get_action_params(
            action="get_script_list",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_script_list", data=params, bk_language=self.request.bk_language
        )
