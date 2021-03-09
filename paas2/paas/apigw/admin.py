# -*- coding: utf-8 -*-
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
