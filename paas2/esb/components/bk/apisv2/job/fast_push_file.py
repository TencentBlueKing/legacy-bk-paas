# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from components.component import Component
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class FastPushFile(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"快速分发文件"
    label_en = "Fast push file"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        account = forms.CharField(label="account name", required=True)
        file_target_path = forms.CharField(label="target file path", required=True)
        file_source = TypeCheckField(label="source file", promise_type=list, required=True)
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=False)
        custom_query_id = TypeCheckField(label="custom query id", promise_type=list, required=False)
        bk_callback_url = forms.CharField(label="callback url", required=False)

        def clean(self):
            data = self.cleaned_data
            param_keys = ["account", "file_target_path", "file_source", "ip_list", "custom_query_id"]
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": self.get_cleaned_data_when_exist(param_keys),
                "bk_callback_url": data["bk_callback_url"],
            }

    def handle(self):
        params = tools.get_action_params(
            action="fast_push_file",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/fast_push_file", data=params, bk_language=self.request.bk_language
        )
