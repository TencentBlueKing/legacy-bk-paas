# -*- coding: utf-8 -*-
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetAppInfo(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取应用信息"
    label_en = "get application info"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        target_app_code = ListField(label="target app code", required=False)
        fields = ListField(label="fields", required=False)

        def clean(self):
            return {
                "target_app_code": ";".join(self.cleaned_data["target_app_code"]),
                "fields": ";".join(self.cleaned_data["fields"]),
            }

    def handle(self):
        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.get(
            configs.host,
            "/paas/api/v2/app_info/",
            params=self.form_data,
        )
