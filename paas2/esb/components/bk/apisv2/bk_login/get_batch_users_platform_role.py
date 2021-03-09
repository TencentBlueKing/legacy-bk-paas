# -*- coding: utf-8 -*-
import json
from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import configs, tools


class GetBatchUsersPlatformRole(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"批量获取用户各平台角色信息"
    label_en = "get role of the users in platforms"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_username_list = ListField(label="username list", required=True)
        bk_token = forms.CharField(label="login token", required=False)

    def handle(self):
        client = tools.LOGINClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=configs.host,
            path="/login/api/v2/get_batch_users_platform_role/",
            data=json.dumps(self.form_data),
        )
