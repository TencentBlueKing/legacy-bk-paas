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

from engine.models import (BkServer, ThirdServer)


class BkServerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 's_id', 'token', 'ip_address', 'ip_port', 'category', 'is_active')
    search_fields = ('name',)
    list_filter = ('name', 'created_at')


class ThirdServerAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'is_active')
    search_fields = ('category',)
    list_filter = ('category', 'created_at')
    exclude = ('server_info', 'info')


admin.site.register(BkServer, BkServerAdmin)
admin.site.register(ThirdServer, ThirdServerAdmin)
