# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from account.forms import BkUserChangeForm, BkUserCreationForm
from account.models import Loignlog


class BkUserAdmin(UserAdmin):
    """The forms to add and change user instances.

    The fields to be used in displaying the User model.
    These override the definitions on the base UserAdmin
    """

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('chname',)}),
        (_('Contact info'), {'fields': ('phone', 'email')}),
        (_('Permissions'), {'fields': ('is_superuser',)}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}),
    )
    form = BkUserChangeForm
    add_form = BkUserCreationForm
    list_display = ('username', 'chname', 'is_superuser')
    list_filter = ('is_superuser',)
    search_fields = ('username', 'chname',)
    ordering = ('username',)


class LoignlogAdmin(admin.ModelAdmin):
    """
    The forms to add and change login log instances.

    The fields to be used in displaying the Loginlog model.
    """

    list_display = ['user', 'login_time', 'login_browser', 'login_ip', 'login_host', 'app_id']
    search_fields = ['user__username']
    list_filter = ['app_id']


# admin.site.register(BkUser, BkUserAdmin)
admin.site.register(Loignlog, LoignlogAdmin)
