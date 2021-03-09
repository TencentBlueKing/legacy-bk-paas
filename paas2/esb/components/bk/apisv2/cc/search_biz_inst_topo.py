# -*- coding: utf-8 -*-
import json
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class SearchBizInstTopo(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"查询业务实例拓扑"
    label_en = "query business instance topology"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        level = forms.IntegerField(label="level", required=False)

        def clean(self):
            data = self.get_cleaned_data_when_exist(keys=["bk_supplier_account", "bk_biz_id"])
            data.setdefault("bk_supplier_account", configs.DEFAULT_BK_SUPPLIER_ACCOUNT)
            data["data"] = self.get_cleaned_data_when_exist(keys=["level"])
            return data

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/find/topoinst/biz/{bk_biz_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
