# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_OP
from .toolkit import tools, configs


class HttpRelay(Component):
    """[FTA] 外网请求代理

    {% block api_doc %}

    描述
    ~~~~

    参数说明
    ~~~~~~~~

    {{ common_args_desc }}

    其他参数

    ===============  ======  ========  ===========================================
    参数名称         必须    类型      参数说明
    ===============  ======  ========  ===========================================
    method           Y       string    请求方法（GET, POST)
    url              Y       int       请求URL
    kwargs           N       kwargs    其他requests支持的参数
    ===============  ======  ========  ===========================================

    请求参数示例
    ~~~~~~~~~~~~

    .. code:: json

        {
            "app_id": "46",
            "method": "GET",
            "url": 'http',
            "data": '',
        }

    结果说明
    ~~~~~~~~

    .. code:: json

        {
            "result": true,
            "code": "00",
            "message": "",
            "data": ''
        }

    {% endblock %}
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        # 没实际用处，仅供ESB使用
        app_id = forms.CharField(label='business ID', required=True)

        # request 方法
        method = forms.CharField(label='request method', required=True)
        url = forms.CharField(label='request url', required=True)

        # requests参数
        kwargs = forms.CharField(label='request parameters', required=False)

        def clean_kwargs(self):
            return self.data.get('kwargs') or {}

    def handle(self):
        client = tools.HttpClient()

        method = self.form_data['method']
        url = self.form_data['url']
        kwargs = self.form_data['kwargs']

        result = client.request(method, url, **kwargs)
        self.response.payload = result
