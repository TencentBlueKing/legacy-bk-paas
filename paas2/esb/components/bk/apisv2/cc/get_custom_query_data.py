# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from .toolkit import tools, configs


class GetCustomQueryData(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"根据自定义查询获取数据"
    label_en = "get customize query data"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        bk_biz_id = forms.IntegerField(label="business id", required=True)
        id = forms.CharField(label="id", required=True)
        start = forms.IntegerField(label="start", required=True)
        limit = forms.IntegerField(label="limit", required=True)

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.get(
            host=self.host,
            path="/api/v3/userapi/data/{bk_biz_id}/{id}/{start}/{limit}".format(**self.form_data),
        )
