# -*- coding: utf-8 -*-

from django.contrib import admin

from release.models import Record, Version, UserOperateRecord


class RecordAdmin(admin.ModelAdmin):
    list_display = ("app_code", "operate_id", "operate_user", "operate_time", "is_success")
    search_fields = ("app_code", "operate_user")
    list_filter = ("operate_id", "operate_user", "operate_time", "app_code")


admin.site.register(Record, RecordAdmin)


class VersionAdmin(admin.ModelAdmin):
    list_display = ("app", "version", "publisher", "pubdate")
    search_fields = ("app__code", "publisher")
    list_filter = ("app", "publisher", "pubdate")


admin.site.register(Version, VersionAdmin)


class UserOperateRecordAdmin(admin.ModelAdmin):
    list_display = ("app_code", "username", "operate_type", "operate_time")
    search_fields = ("username", "app_code")
    list_filter = ("username", "operate_type", "operate_time", "app_code")


admin.site.register(UserOperateRecord, UserOperateRecordAdmin)
