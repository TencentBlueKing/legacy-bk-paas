# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class CreateCustomQuery(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"添加自定义查询"
    label_en = "create customize query"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        info = forms.CharField(label="info", required=True)
        name = forms.CharField(label="name", required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/userapi",
            data=json.dumps(self.form_data),
        )
