#!/usr/bin/env python
# encoding: utf-8


from django.contrib import admin

from engine.models import BkServer, ThirdServer


class BkServerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "s_id", "token", "ip_address", "ip_port", "category", "is_active")
    search_fields = ("name",)
    list_filter = ("name", "created_at")


class ThirdServerAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "is_active")
    search_fields = ("category",)
    list_filter = ("category", "created_at")
    exclude = ("server_info", "info")


admin.site.register(BkServer, BkServerAdmin)
admin.site.register(ThirdServer, ThirdServerAdmin)
