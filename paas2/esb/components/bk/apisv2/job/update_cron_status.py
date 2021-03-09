# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class UpdateCronStatus(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新定时作业状态"
    label_en = "Update cron status"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        cron_status = forms.IntegerField(label="timing status", required=True)
        cron_id = forms.IntegerField(label="cron job id", required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": {
                    "cron_status": data["cron_status"],
                    "cron_id": data["cron_id"],
                },
            }

    def handle(self):
        params = tools.get_action_params(
            action="update_cron_status",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/update_cron_status", data=params, bk_language=self.request.bk_language
        )
