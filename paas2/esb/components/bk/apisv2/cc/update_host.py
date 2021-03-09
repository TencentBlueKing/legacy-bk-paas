# -*- coding: utf-8 -*-
import json

from common.forms import BaseComponentForm, ListField, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateHost(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新主机属性"
    label_en = "Update host property"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_host_id = ListField(label="host ids", required=True)
        data = TypeCheckField(label="data", promise_type=dict, required=False)

        def clean(self):
            data = self.cleaned_data
            data["data"].update(bk_host_id=",".join(map(str, data["bk_host_id"])))
            return data["data"]

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path="/api/v3/hosts/batch",
            data=json.dumps(self.form_data),
        )
