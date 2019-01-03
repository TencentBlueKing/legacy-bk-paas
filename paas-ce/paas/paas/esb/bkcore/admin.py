# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.contrib import admin
from .models import *    # noqa


class ComponentSystemAdmin(admin.ModelAdmin):
    list_display = ('name', 'label_display')
    search_fields = ('name', )


class ESBChannelAdmin(admin.ModelAdmin):
    list_display = ('id', 'component_system', 'name_display', 'path', 'component_codename', 'is_active')
    search_fields = ('name', 'path', 'component_codename')


class FunctionControllerAdmin(admin.ModelAdmin):
    def get_created_time(self, obj):
        return obj.created_time.strftime('%Y-%m-%d %H:%M:%S')
    get_created_time.short_description = u'创建时间'

    list_display = ('func_code', 'func_name', 'switch_status', 'get_created_time')
    search_fields = ('func_code', 'func_name')


class UserAuthTokenAdmin(admin.ModelAdmin):
    def get_expires(self, obj):
        return obj.expires.strftime('%Y-%m-%d %H:%M:%S')
    get_expires.short_description = u'token过期时间'

    list_display = ('app_code', 'username', 'auth_token', 'get_expires')
    search_fields = ('app_code', 'username', 'auth_token')


class ESBBuffetComponentAdmin(admin.ModelAdmin):
    list_display = ('system', 'name', 'submitter', 'status')
    search_fields = ('name', )


class ESBBuffetMappingAdmin(admin.ModelAdmin):
    list_display = ('name', 'source_type', 'owner', 'is_active')
    search_fields = ('name', )


class AppAccountAdmin(admin.ModelAdmin):
    list_display = ('app_code', 'app_token', 'created_time')
    search_fields = ('app_code', )


class AppComponentPermAdmin(admin.ModelAdmin):
    list_display = ('app_code', 'component_id', 'created_time', 'last_accessed_time')
    search_fields = ('app_code', 'component_id')
    fields = ('app_code', 'component_id', 'last_accessed_time')


class WxmpAccessTokenAdmin(admin.ModelAdmin):
    list_display = ('wx_app_id', 'access_token', 'expires')
    search_fields = ('wx_app_id', 'access_token')


class SystemDocCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'priority')
    search_fields = ('id', 'name')


admin.site.register(ComponentSystem, ComponentSystemAdmin)  # noqa
admin.site.register(ESBChannel, ESBChannelAdmin)  # noqa
admin.site.register(FunctionController, FunctionControllerAdmin)  # noqa
# admin.site.register(UserAuthToken, UserAuthTokenAdmin)  # noqa
admin.site.register(ESBBuffetComponent, ESBBuffetComponentAdmin)  # noqa
# admin.site.register(ESBBuffetMapping, ESBBuffetMappingAdmin)  # noqa
admin.site.register(AppAccount, AppAccountAdmin)  # noqa
admin.site.register(AppComponentPerm, AppComponentPermAdmin)  # noqa
admin.site.register(WxmpAccessToken, WxmpAccessTokenAdmin)  # noqa
admin.site.register(SystemDocCategory, SystemDocCategoryAdmin)  # noqa
