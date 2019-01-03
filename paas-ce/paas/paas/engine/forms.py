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

from engine.constants import SERVER_CATEGORY_CHOICES
from engine.models import THIRD_SERVER_CATEGORY_CHOICES


class ServerForm(forms.Form):
    server_id = forms.IntegerField(required=False)
    server_ip = forms.GenericIPAddressField(required=True,
                                            error_messages={
                                                "required": "服务器 IP 地址不能为空",
                                                "invalid": "服务器IP格式不正确"
                                            })
    server_port = forms.IntegerField(min_value=1, error_messages={"required": "Agent端口不能为空", "invalid": "Agent端口必须为整数"})
    app_port = forms.IntegerField(min_value=1, error_messages={"required": "App服务端口不能为空", "invalid": "App服务端口必须为整数"})
    server_cate = forms.ChoiceField(choices=SERVER_CATEGORY_CHOICES,
                                    error_messages={
                                        "required": "服务器类别不能为空",
                                        "invalid_choice": "服务器类别不正确"
                                    })


class ExternalServerForm(forms.Form):
    server_id = forms.IntegerField(required=False)
    server_ip = forms.GenericIPAddressField(required=True,
                                            error_messages={
                                                "required": "服务器 IP 地址不能为空",
                                                "invalid": "服务器IP格式不正确"
                                            })
    server_port = forms.IntegerField(min_value=1, error_messages={"required": "端口不能为空", "invalid": "端口必须为整数"})
    server_cate = forms.ChoiceField(choices=THIRD_SERVER_CATEGORY_CHOICES,
                                    error_messages={
                                        "required": "服务器类别不能为空",
                                        "invalid_choice": ""
                                    })
    username = forms.CharField(error_messages={"required": "用户名不能为空"})
    password = forms.CharField(error_messages={"required": "密码不能为空"})
