# -*- coding: utf-8 -*-
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class ExecuteJob(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"启动作业"
    label_en = "Execute job"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_job_id = forms.IntegerField(label="job id", required=True)
        steps = TypeCheckField(label="step parameters", promise_type=list, required=False)
        global_vars = TypeCheckField(label="global vars", promise_type=list, required=False)
        bk_callback_url = forms.CharField(label="callback url", required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": self.get_cleaned_data_when_exist(keys=["bk_job_id", "steps", "global_vars"]),
                "bk_callback_url": data["bk_callback_url"],
            }

    def handle(self):
        params = tools.get_action_params(
            action="execute_job",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/execute_job", data=params, bk_language=self.request.bk_language
        )
