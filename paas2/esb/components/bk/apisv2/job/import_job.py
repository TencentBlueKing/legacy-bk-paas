# -*- coding: utf-8 -*-
from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD

from .toolkit import tools, configs


class ImportJob(Component):

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    suggest_method = HTTP_METHOD.POST
    label = u"导入作业"
    label_en = "import job"

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        params = TypeCheckField(label="params", promise_type=dict, required=True)

    def handle(self):
        params = tools.get_action_params(
            action="import_job",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/import_job", data=params, bk_language=self.request.bk_language
        )
