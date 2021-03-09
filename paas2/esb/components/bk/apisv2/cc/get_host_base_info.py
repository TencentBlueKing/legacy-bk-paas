# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class GetHostBaseInfo(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取主机详情"
    label_en = "get host detail"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_host_id = forms.IntegerField(label="host id", required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path="/api/v3/hosts/{bk_supplier_account}/{bk_host_id}".format(**self.form_data),
        )
