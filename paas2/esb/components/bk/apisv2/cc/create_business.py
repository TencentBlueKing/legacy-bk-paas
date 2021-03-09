# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class CreateBusiness(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"新建业务"
    label_en = "New business"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        data = TypeCheckField(label="data", promise_type=dict, required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/biz/{bk_supplier_account}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
