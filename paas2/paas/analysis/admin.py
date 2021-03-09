# -*- coding: utf-8 -*-
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
