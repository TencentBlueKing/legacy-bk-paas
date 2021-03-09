# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class SearchHost(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"根据条件查询主机"
    label_en = "search host by condition"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=False)
        ip = TypeCheckField(label="ip", promise_type=dict, required=False)
        condition = TypeCheckField(label="condition", promise_type=list, required=False)
        page = TypeCheckField(label="page", promise_type=dict, required=False)
        pattern = forms.CharField(label="pattern", required=False)

        def clean(self):
            return self.get_cleaned_data_when_exist()

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/hosts/search",
            data=json.dumps(self.form_data),
        )
