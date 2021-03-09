# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class SearchCustomQuery(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"查询自定义查询"
    label_en = "search customize query"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        condition = TypeCheckField(label="condition", promise_type=dict, required=False)
        start = forms.IntegerField(label="start", required=True)
        limit = forms.IntegerField(label="limit", required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "bk_biz_id": data["bk_biz_id"],
                "data": self.get_cleaned_data_when_exist(keys=["condition", "start", "limit"]),
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/userapi/search/{bk_biz_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
