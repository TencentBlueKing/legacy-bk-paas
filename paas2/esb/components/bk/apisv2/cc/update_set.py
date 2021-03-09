# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateSet(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新集群"
    label_en = "update set"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_set_id = forms.IntegerField(label="set id", required=True)
        data = TypeCheckField(label="data", promise_type=dict, required=False)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.put(
            host=self.host,
            path="/api/v3/set/{bk_biz_id}/{bk_set_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
