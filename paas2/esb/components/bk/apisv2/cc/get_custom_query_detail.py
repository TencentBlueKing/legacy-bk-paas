# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class GetCustomQueryDetail(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取自定义查询详情"
    label_en = "get customize query detail"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        id = forms.CharField(label="id", required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path="/api/v3/userapi/detail/{bk_biz_id}/{id}".format(**self.form_data),
        )
