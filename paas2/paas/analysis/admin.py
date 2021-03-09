# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from django.contrib import admin

from analysis.models import AppUseRecord, AppLiveness, AppOnlineTimeRecord


class AppUseRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "app", "source_ip", "access_host", "use_time")
    search_fields = ("source_ip", "user__username", "app__name", "app__code")
    list_filter = ("app", "user")


admin.site.register(AppUseRecord, AppUseRecordAdmin)


class AppLivenessAdmin(admin.ModelAdmin):
    list_display = ("user", "app", "hits", "source_ip", "access_host", "add_date")
    search_fields = ("source_ip", "user__username", "app__name", "app__code")
    list_filter = ("app", "user")


admin.site.register(AppLiveness, AppLivenessAdmin)


class AppOnlineTimeRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "app_code", "online_time", "record_type", "source_ip", "access_host", "add_date")
    search_fields = ("source_ip", "user__username", "app_code")
    list_filter = ("app_code", "record_type", "user")


admin.site.register(AppOnlineTimeRecord, AppOnlineTimeRecordAdmin)
