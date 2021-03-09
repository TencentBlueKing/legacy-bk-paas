# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class BindRolePrivilege(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"绑定角色权限"
    label_en = "bind role privilege"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_supplier_account = forms.CharField(label="bk supplier account", required=True)
        bk_obj_id = forms.CharField(label="bk obj id", required=True)
        bk_property_id = forms.CharField(label="bk property id", required=True)
        data = ListField(label="data", required=False)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            self.host,
            path="/api/v3/topo/privilege/{bk_supplier_account}/{bk_obj_id}/{bk_property_id}".format(**self.form_data),
            data=json.dumps(self.form_data["data"]),
        )
