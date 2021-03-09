# -*- coding: utf-8 -*-
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class PushConfigFile(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"分发配置文件"
    label_en = "Push config file"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        account = forms.CharField(label="account name", required=True)
        file_target_path = forms.CharField(label="file target path", required=True)
        file_list = TypeCheckField(label="file list", promise_type=list, required=True)
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": {
                    "account": data["account"],
                    "file_target_path": data["file_target_path"],
                    "file_list": data["file_list"],
                    "ip_list": data["ip_list"],
                },
            }

    def handle(self):
        params = tools.get_action_params(
            action="push_config_file",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/push_config_file", data=params, bk_language=self.request.bk_language
        )
