# -*- coding: utf-8 -*-
from django.contrib import admin
from api.models import ApiWhiteList


class ApiWhiteListAdmin(admin.ModelAdmin):
    list_display = ("api_name", "app_code")
    search_fields = ("app_code", "api_name")
    list_filter = ("api_name",)


admin.site.register(ApiWhiteList, ApiWhiteListAdmin)
