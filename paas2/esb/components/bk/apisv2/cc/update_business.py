# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateBusiness(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"修改业务"
    label_en = "update business"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        data = TypeCheckField(label="data", promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path="/api/v3/biz/{bk_supplier_account}/{bk_biz_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
