# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class TransferHostToResourcemodule(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"上交主机至资源池"
    label_en = "transfer host to resource module"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_host_id = TypeCheckField(label="host id", promise_type=list, required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/hosts/modules/resource",
            data=json.dumps(self.form_data),
        )
