# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class AddHostToResource(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"新增主机到资源池"
    label_en = "add host to resource"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        host_info = TypeCheckField(label="host info", required=True)
        bk_biz_id = forms.IntegerField(label="business ID", required=False)

        def clean(self):
            return self.get_cleaned_data_when_exist()

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            self.host,
            path="/api/v3/hosts/add",
            data=json.dumps(self.form_data),
        )
