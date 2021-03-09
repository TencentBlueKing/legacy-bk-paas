# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component

from .toolkit import tools, configs


class GetScriptDetail(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"查询脚本详情"
    label_en = "Get Script Detail"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=False)
        id = forms.IntegerField(label="script id", required=True)

        def clean(self):
            data = self.cleaned_data
            params = self.get_cleaned_data_when_exist(keys=["bk_biz_id"])
            params["params"] = {
                "id": data["id"],
            }
            return params

    def handle(self):
        params = tools.get_action_params(
            action="get_script_detail",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_script_detail", data=params, bk_language=self.request.bk_language
        )
