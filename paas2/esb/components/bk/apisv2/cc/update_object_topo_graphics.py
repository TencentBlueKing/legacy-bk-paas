# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class UpdateObjectTopoGraphics(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"更新拓扑图"
    label_en = "update a topo graphics"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        scope_type = forms.CharField(label="scope type", required=True)
        scope_id = forms.CharField(label="scope id", required=True)
        action = forms.CharField(label="action", required=True)
        data = TypeCheckField(label="data", promise_type=list, required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post(
            host=self.host,
            path="/api/v3/objects/topographics/scope_type/{scope_type}/scope_id/{scope_id}/action/{action}".format(
                **self.form_data
            ),  # noqa
            data=json.dumps(self.form_data["data"]),
        )
