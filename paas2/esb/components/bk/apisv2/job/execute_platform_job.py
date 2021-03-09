# -*- coding: utf-8 -*-
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class ExecutePlatformJob(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"启动平台作业"
    label_en = "Execute platform job"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_job_id = forms.IntegerField(label="job id", required=True)
        source_bk_biz_id = forms.IntegerField(label="source business id", required=True)
        target_bk_biz_id = forms.IntegerField(label="target business id", required=True)
        steps = TypeCheckField(label="step parameters", promise_type=list, required=False)
        bk_callback_url = forms.CharField(label="callback url", required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                "params": self.get_cleaned_data_when_exist(
                    keys=["source_bk_biz_id", "target_bk_biz_id", "bk_job_id", "steps"]
                ),
                "bk_callback_url": data["bk_callback_url"],
            }

    def handle(self):
        params = tools.get_action_params(
            action="execute_platform_job",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/execute_platform_job", data=params, bk_language=self.request.bk_language
        )
