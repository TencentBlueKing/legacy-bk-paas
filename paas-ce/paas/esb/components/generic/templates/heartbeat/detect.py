# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import time

from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from .toolkit import configs


class Detect(Component):
    """心跳探测，测试用
    """

    sys_name = configs.SYSTEM_NAME

    class Form(BaseComponentForm):
        timestamp = forms.IntegerField(label=u'心跳时间', required=True)
        sleep_time = forms.IntegerField(label=u'Sleep时间', required=False)

    def handle(self):
        if self.form_data.get('sleep_time'):
            time.sleep(self.form_data['sleep_time'])

        self.response.payload = {
            'result': True,
            'data': {
                'timestamp': self.form_data['timestamp'],
                'now': int(time.time()),
            }
        }
