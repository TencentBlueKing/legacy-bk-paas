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


class UploadFileForm(forms.Form):
    saas_file = forms.FileField()

    def clean_saas_file(self):
        saas_file = self.cleaned_data["saas_file"]

        if not saas_file or not saas_file.name:
            self.add_error('saas_file', "上传文件失败!")

        if not saas_file.name.endswith(".tar.gz"):
            self.add_error('saas_file', "错误的文件! SaaS应用为.tar.gz格式")

        return saas_file
