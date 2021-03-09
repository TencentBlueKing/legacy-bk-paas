# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class DeleteCustomQuery(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"删除自定义查询"
    label_en = "delete customize query"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        id = forms.CharField(label="id", required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.delete(
            host=self.host,
            path="/api/v3/userapi/{bk_biz_id}/{id}".format(**self.form_data),
        )
