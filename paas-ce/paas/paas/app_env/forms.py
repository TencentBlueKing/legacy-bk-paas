# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


from __future__ import unicode_literals

from django import forms

from app_env.constants import ENV_MODE_TYPE_CHOICES
from django.core.validators import RegexValidator


class AppEnvForm(forms.Form):
    name = forms.CharField(max_length=44, error_messages={"required": "变量名不能为空!",
                                                          "max_length": "变量名不能超过50个字符!"},
                           validators=[RegexValidator(r'^[a-zA-Z0-9_]+$', message="请输入合法的变量名, 只允许字母数字下划线!")])
    value = forms.CharField(max_length=100, error_messages={
        "required": "变量名不能为空!",
        "max_length": "变量值不能超过1000个字符!"
    })
    intro = forms.CharField()
    mode = forms.ChoiceField(choices=ENV_MODE_TYPE_CHOICES,
                             error_messages={
                                 "required": "环境类型不能为空",
                                 "invalid_choice": "非法的类型"
                             })

    def clean_value(self):
        value = self.cleaned_data["value"]
        if '"' in value:
            self.add_error('value', "变量值不能包含引号!")
        return value
