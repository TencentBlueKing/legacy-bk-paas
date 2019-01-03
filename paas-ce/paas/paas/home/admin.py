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
from django.contrib import admin

from home.constants import LinkTypeEnum
from home.models import UsefulLinks, UserSettings


# Register your models here.
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('username', 'apps')
    search_fields = ('username',)
    list_filter = ('username',)


admin.site.register(UserSettings, UserSettingsAdmin)


class UsefulLinksForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super(UsefulLinksForm, self).clean()
        if cleaned_data.get('link_type') == LinkTypeEnum.SAAS.value and not cleaned_data.get('logo'):
            raise forms.ValidationError("选择 SaaS 类型的链接必须上传 Logo")

    class Meta:
        model = UsefulLinks
        fields = '__all__'


class UsefulLinksAdmin(admin.ModelAdmin):
    list_display = ('name', 'link', 'link_type', 'is_active')
    search_fields = ('name',)
    list_filter = ('name',)

    form = UsefulLinksForm


admin.site.register(UsefulLinks, UsefulLinksAdmin)
