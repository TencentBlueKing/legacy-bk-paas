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

from . import models


class APIAdmin(admin.ModelAdmin):
    def get_created_time(self, obj):
        return obj.created_time.strftime("%Y-%m-%d %H:%M:%S")

    get_created_time.short_description = u"创建时间"

    list_display = ("id", "api_name", "creator", "get_created_time", "api_type")
    search_fields = ("id", "api_name")
    exclude = ("private_key", "public_key")


class StageAdmin(admin.ModelAdmin):
    list_display = ("id", "api_id", "stage_name")
    search_fields = ("api_id", "stage_name")


class ResourceAdmin(admin.ModelAdmin):
    def get_created_time(self, obj):
        return obj.created_time.strftime("%Y-%m-%d %H:%M:%S")

    get_created_time.short_description = u"创建时间"

    list_display = (
        "id",
        "api_id",
        "skip_auth_verification",
        "auth_verified_required",
        "app_verified_required",
        "rate_limit_required",
        "registed_http_method",
        "path",
        "get_created_time",
    )
    search_fields = ("id", "api_id", "path", "dest_url")
    list_filter = ("api_id",)


class StageRelatedResoueceAdmin(admin.ModelAdmin):
    list_display = ("api_id", "stage_id", "resource_id", "status", "created_time")
    search_fields = ("api_id", "stage_id", "resource_id")


admin.site.register(models.API, APIAdmin)
admin.site.register(models.Stage, StageAdmin)
admin.site.register(models.Resource, ResourceAdmin)
admin.site.register(models.StageRelatedResouece, StageRelatedResoueceAdmin)
