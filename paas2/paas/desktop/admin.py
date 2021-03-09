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

from desktop.models import UserSettings, UserApp, Wallpaper


class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "appxy", "dockpos", "skin", "wallpaper_id", "wallpaper_type")
    search_fields = ("user__username",)
    list_filter = ("user",)


admin.site.register(UserSettings, UserSettingsAdmin)


class UserAppAdmin(admin.ModelAdmin):
    list_display = ("user", "app", "desk_app_type", "app_position", "add_time")
    search_fields = ("user__username", "app__name", "app__code")
    list_filter = ("app", "user")


admin.site.register(UserApp, UserAppAdmin)


class WallpaperAdmin(admin.ModelAdmin):
    list_display = ("name", "number", "width", "height", "is_default")
    search_fields = ("name",)
    list_filter = ("is_default",)


admin.site.register(Wallpaper, WallpaperAdmin)
