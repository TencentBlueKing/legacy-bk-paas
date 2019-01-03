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

from app.models import App, AppTags, SecureInfo


class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'creater', 'created_date', 'state', 'is_already_test', 'is_already_online')
    search_fields = ('name', 'code', 'creater')
    list_filter = ('creater', 'created_date', 'is_saas')


admin.site.register(App, AppAdmin)


class SecureInfoAdmin(admin.ModelAdmin):
    list_display = ('app_code', 'vcs_type', 'vcs_url', 'vcs_username')
    search_fields = ('app_code', )
    list_filter = ('vcs_type', )
    exclude = ('vcs_url', 'vcs_username', 'vcs_password',
               'db_host', 'db_port', 'db_name', 'db_username', 'db_password')


admin.site.register(SecureInfo, SecureInfoAdmin)


class AppTagsAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'index')
    search_fields = ('code', 'name')


admin.site.register(AppTags, AppTagsAdmin)
