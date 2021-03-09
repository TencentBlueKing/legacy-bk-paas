# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class TransferHostModule(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"业务内主机转移模块"
    label_en = "transfer host to module in biz"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_host_id = TypeCheckField(label="host id", promise_type=list, required=True)
        bk_module_id = TypeCheckField(label="module id", promise_type=list, required=True)
        is_increment = TypeCheckField(label="is increment", promise_type=bool, required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/hosts/modules",
            data=json.dumps(self.form_data),
        )
