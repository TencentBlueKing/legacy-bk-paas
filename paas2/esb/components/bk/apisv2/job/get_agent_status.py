# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from components.component import Component
from common.constants import API_TYPE_Q, HTTP_METHOD

from .toolkit import tools, configs


# 与 GSE get_agent_status 功能重复，不对外开放此组件


class GetAgentStatus(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"查询Agent状态"
    label_en = "Get Agent status"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "params": {
                    "ip_list": data["ip_list"],
                },
            }

    def handle(self):
        params = tools.get_action_params(
            action="get_agent_status",
            params=self.form_data,
            operator=self.current_user.username,
            app_code=self.request.app_code,
            request_id=self.request.request_id,
        )

        client = tools.JOBClient(self.outgoing.http_client)
        self.response.payload = client.post(
            self.host, "/api/v2/get_agent_status", data=params, bk_language=self.request.bk_language
        )
