# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class DeleteModule(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"删除模块"
    label_en = "Delete module"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        bk_set_id = forms.IntegerField(label="set id", required=True)
        bk_module_id = forms.IntegerField(label="module id", required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.delete(
            host=self.host,
            path="/api/v3/module/{bk_biz_id}/{bk_set_id}/{bk_module_id}".format(**self.form_data),
        )
