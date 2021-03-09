# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class SearchBusiness(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"查询业务"
    label_en = "search the business"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        fields = TypeCheckField(label="fields", promise_type=list, required=False)
        condition = TypeCheckField(label="condition", promise_type=dict, required=False)
        page = TypeCheckField(label="page", promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=["bk_supplier_account"])
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data["data"] = self.get_cleaned_data_when_exist(keys=["fields", "condition", "page"])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/biz/search/{bk_supplier_account}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
