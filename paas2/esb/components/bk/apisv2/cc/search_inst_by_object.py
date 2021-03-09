# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class SearchInstByObject(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"查询实例详情"
    label_en = "search inst by object"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_obj_id = forms.CharField(label="object id", required=True)
        fields = TypeCheckField(label="fields", promise_type=list, required=False)
        condition = TypeCheckField(label="condition", promise_type=dict, required=False)
        page = TypeCheckField(label="page", promise_type=dict, required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=["bk_supplier_account", "bk_obj_id"])
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data["data"] = self.get_cleaned_data_when_exist(keys=["fields", "condition", "page"])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/find/instance/object/{bk_obj_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
