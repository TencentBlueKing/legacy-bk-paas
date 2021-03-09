# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_Q, HTTP_METHOD

from .toolkit import tools, configs


class GetJobInstanceGlobalVarValue(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取作业实例全局变量的值"
    label_en = "Get job instance global variable value"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        job_instance_id = forms.CharField(label="job instance id", required=True)

        def clean(self):
            data = self.cleaned_data
            return {"bk_biz_id": data["bk_biz_id"], "params": {"job_instance_id": data["job_instance_id"]}}

    def handle(self):
        params = tools.get_action_params(
            action="get_job_instance_global_var_value",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_job_instance_global_var_value", data=params, bk_language=self.request.bk_language
        )
