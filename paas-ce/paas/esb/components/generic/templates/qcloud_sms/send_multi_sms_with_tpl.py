# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, TypeCheckField, ListField
from common.constants import API_TYPE_OP
from .toolkit import tools, configs


class SendMultiSmsWithTpl(Component, SetupConfMixin):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        sdk_app_id = forms.CharField(label=u'腾讯云sdkappid', required=True)
        app_key = forms.CharField(label=u'腾讯云appkey', required=True)
        sign = forms.CharField(label=u'短信签名', required=False)
        tpl_id = forms.IntegerField(label=u'短信模版ID', required=True)
        params = TypeCheckField(label=u'模版参数', promise_type=list, required=False)
        nation_code = forms.CharField(label=u'国家码', required=False)
        phone_numbers = ListField(label=u'不带国家码的手机号', required=True)
        extend = forms.CharField(label=u'通道扩展码', required=False)
        ext = forms.CharField(label=u'服务端原样返回的参数', required=False)

        def clean(self):
            data = self.cleaned_data
            nation_code = data['nation_code'] or configs.default_nation_code
            new_data = {
                'tel': [
                    {'nationcode': nation_code, 'mobile': phone_number}
                    for phone_number in data['phone_numbers']
                ],
                'sign': data['sign'],
                'tpl_id': data['tpl_id'],
                'params': data['params'],
                'extend': data['extend'],
                'ext': data['ext'],
            }
            return new_data

    def handle(self):
        sdk_app_id = self.request.kwargs.get('sdk_app_id')
        app_key = self.request.kwargs.get('app_key')

        client = tools.QCloudSmsClient(self.outgoing.http_client)
        rnd = client.get_random()
        cur_time = client.get_cur_time()
        self.form_data['time'] = cur_time
        self.form_data['sig'] = client.calculate_sig(app_key, rnd, cur_time, self.request.kwargs['phone_numbers'])

        result = client.post(
            'https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2?sdkappid=%s&random=%s' % (sdk_app_id, rnd),
            data=self.form_data,
        )
        self.response.payload = result
