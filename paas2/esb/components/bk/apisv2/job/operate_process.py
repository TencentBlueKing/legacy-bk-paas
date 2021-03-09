# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class OperateProcess(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"进程操作"
    label_en = "Process operation"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        op_type = forms.IntegerField(label="process operation type", required=True)
        process_infos = TypeCheckField(label="process information", promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": {
                    "op_type": data["op_type"],
                    "process_infos": data["process_infos"],
                },
            }

    def handle(self):
        params = tools.get_action_params(
            action="operate_process",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/operate_process", data=params, bk_language=self.request.bk_language
        )
