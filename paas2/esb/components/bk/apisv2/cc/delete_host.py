# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class DeleteHost(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"删除主机"
    label_en = "delete host"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_host_id = ListField(label="host ids", required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data["bk_host_id"] = ",".join(data["bk_host_id"])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.delete(
            host=self.host,
            path="/api/v3/hosts/batch",
            data=json.dumps(self.form_data),
        )
