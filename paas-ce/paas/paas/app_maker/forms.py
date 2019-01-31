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

from home.models import UsefulLinks
from app.models import App
from app_maker.utils import validate_app_url, validate_light_app_name


class LightAppChangeBaseInfoForm(forms.Form):
    bk_light_app_code = forms.CharField()

    def clean_bk_light_app_code(self):
        bk_light_app_code = self.cleaned_data["bk_light_app_code"]
        is_ok, link = UsefulLinks.objects.is_useful_link(bk_light_app_code)
        if not is_ok:
            self.add_error("bk_light_app_code", "轻应用不存在")

        return bk_light_app_code


class LightAppCreationForm(forms.Form):
    bk_app_code = forms.CharField()
    bk_light_app_name = forms.CharField()
    app_url = forms.CharField()
    introduction = forms.CharField(required=False)

    def clean_bk_app_code(self):
        bk_app_code = self.cleaned_data["bk_app_code"]
        if not App.objects.filter(code=bk_app_code).exists():
            self.add_error('bk_app_code', "应用（%s）不存在" % bk_app_code)

        return bk_app_code

    def clean_bk_light_app_name(self):
        bk_light_app_name = self.cleaned_data["bk_light_app_name"]
        # for create, the old_name is ''
        valid, message = validate_light_app_name(bk_light_app_name, '')
        if not valid:
            self.add_error('bk_light_app_name', message)

        return bk_light_app_name

    def clean_app_url(self):
        app_url = self.cleaned_data['app_url']
        if not app_url:
            self.add_error("app_url", "APP链接不能为空")
        else:
            valid, message = validate_app_url(app_url)
            if not valid:
                self.add_error("app_url", message)

        return app_url


class LightAppEditionForm(LightAppChangeBaseInfoForm):
    bk_light_app_name = forms.CharField(required=False)
    app_url = forms.CharField(required=False)
    introduction = forms.CharField(required=False)

    def clean_bk_light_app_name(self):
        bk_light_app_name = self.cleaned_data["bk_light_app_name"]
        if bk_light_app_name:
            bk_light_app_code = self.cleaned_data["bk_light_app_code"]
            is_ok, link = UsefulLinks.objects.is_useful_link(bk_light_app_code)
            if is_ok:
                old_app_name = link.name
                valid, message = validate_light_app_name(bk_light_app_name, old_app_name)
                if not valid:
                    self.add_error('bk_light_app_name', message)

        return bk_light_app_name

    def clean_app_url(self):
        app_url = self.cleaned_data['app_url']
        valid, message = validate_app_url(app_url)
        if not valid:
            self.add_error("app_url", message)

        return app_url


class LightAppLogoModifiedForm(LightAppChangeBaseInfoForm):
    logo = forms.CharField()

    def clean_logo(self):
        logo = self.cleaned_data['logo']
        if not logo:
            self.add_error("logo", "logo 不允许为空")

        return logo
