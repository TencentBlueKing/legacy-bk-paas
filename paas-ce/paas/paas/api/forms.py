# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals
import urlparse

from django import forms
from django.conf import settings

from common.log import logger
from home.models import UsefulLinks
from app.models import App


class LightAppBaseForm(forms.Form):
    def validate_light_app_name(self, name, old_name):
        """
        校验app名称
        """
        if len(name) > 20:
            return False, "应用名称长度不能超过20个字符"

        query = UsefulLinks.objects.filter(name=name)
        if old_name:
            query = query.exclude(name=old_name)
        if query.exists():
            return False, "应用名称[{}]已存在".format(name)
        return True, "校验通过"

    def validate_app_url(self, url):
        """
        判断url是否在当前域名下
        """
        try:
            url_pares = urlparse.urlparse(url)
            hostname = url_pares.hostname
            paas_domain = settings.PAAS_DOMAIN.split(":")[0] if settings.PAAS_DOMAIN else ''
            if not hostname or hostname == paas_domain:
                return True, ''
            return False, "APP链接不合法，链接不在当前域名下"
        except Exception as e:
            logger.error("获取url的域名出错:%s, url:%s" % (e, url))
            return False, "校验APP链接异常"


class LightAppChangeBaseInfoForm(LightAppBaseForm):
    bk_light_app_code = forms.CharField()

    def clean_bk_light_app_code(self):
        bk_light_app_code = self.cleaned_data["bk_light_app_code"]
        is_ok, link = UsefulLinks.objects.is_useful_link(bk_light_app_code)
        if not is_ok:
            self.add_error("bk_light_app_code", "轻应用不存在")

        return bk_light_app_code


class LightAppCreateForm(LightAppBaseForm):
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
        valid, message = self.validate_light_app_name(bk_light_app_name, '')
        if not valid:
            self.add_error('bk_light_app_name', message)

        return bk_light_app_name

    def clean_app_url(self):
        app_url = self.cleaned_data['app_url']
        if not app_url:
            self.add_error("app_url", "APP链接不能为空")
        else:
            valid, message = self.validate_app_url(app_url)
            if not valid:
                self.add_error("app_url", message)

        return app_url


class LightAppEditForm(LightAppChangeBaseInfoForm):
    bk_light_app_name = forms.CharField(required=False)
    app_url = forms.CharField(required=False)
    introduction = forms.CharField(required=False)

    def clean_bk_light_app_name(self):
        bk_light_app_name = self.cleaned_data["bk_light_app_name"]
        if bk_light_app_name:
            bk_light_app_code = self.cleaned_data.get('bk_light_app_code')
            is_ok, link = UsefulLinks.objects.is_useful_link(bk_light_app_code)
            if is_ok:
                old_app_name = link.name
                valid, message = self.validate_light_app_name(bk_light_app_name, old_app_name)
                if not valid:
                    self.add_error('bk_light_app_name', message)

        return bk_light_app_name

    def clean_app_url(self):
        app_url = self.cleaned_data['app_url']
        valid, message = self.validate_app_url(app_url)
        if not valid:
            self.add_error("app_url", message)

        return app_url


class LightAppLogoModifyForm(LightAppChangeBaseInfoForm):
    logo = forms.CharField()

    def clean_logo(self):
        logo = self.cleaned_data['logo']
        if not logo:
            self.add_error("logo", "logo 不允许为空")

        return logo
