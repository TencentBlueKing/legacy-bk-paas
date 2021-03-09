# -*- coding: utf-8 -*-
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD

from .toolkit import tools, configs


class GetStepInstanceStatus(Component):
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    suggest_method = HTTP_METHOD.POST
    label = u"查询作业步骤的执行状态"
    label_en = "Get step instance status"

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        params = TypeCheckField(label="params", promise_type=dict, required=True)

    def handle(self):
        params = tools.get_action_params(
            action="get_step_instance_status",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_step_instance_status", data=params, bk_language=self.request.bk_language
        )
