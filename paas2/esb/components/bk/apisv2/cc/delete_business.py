# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class DeleteBusiness(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"删除业务"
    label_en = "Delete business"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_biz_id = forms.IntegerField(label="business id", required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.delete(
            host=self.host,
            path="/api/v3/biz/{bk_supplier_account}/{bk_biz_id}".format(**self.form_data),
        )
