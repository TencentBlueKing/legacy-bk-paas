# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class SaveCron(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"新建或保存定时作业"
    label_en = "Save cron"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_job_id = forms.IntegerField(label="job id", required=True)
        cron_id = forms.IntegerField(label="cron job id", required=False)
        cron_name = forms.CharField(label="cron job name", required=False)
        cron_expression = forms.CharField(label="cron rules", required=False)

        def clean(self):
            data = self.cleaned_data
            param_keys = ["bk_job_id", "cron_id", "cron_name", "cron_expression"]
            return {"bk_biz_id": data["bk_biz_id"], "params": self.get_cleaned_data_when_exist(param_keys)}

    def handle(self):
        params = tools.get_action_params(
            action="save_cron",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/save_cron", data=params, bk_language=self.request.bk_language
        )
