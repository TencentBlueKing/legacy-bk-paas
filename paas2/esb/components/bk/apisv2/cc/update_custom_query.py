# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateCustomQuery(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新自定义查询"
    label_en = "update customize query"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        id = forms.CharField(label="id", required=True)
        info = forms.CharField(label="info", required=False)
        name = forms.CharField(label="name", required=False)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "id": data["id"],
                "data": self.get_cleaned_data_when_exist(keys=["info", "name"]),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path="/api/v3/userapi/{bk_biz_id}/{id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
