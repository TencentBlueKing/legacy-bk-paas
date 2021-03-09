# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin

from bkaccount.models import Loignlog


class LoignlogAdmin(admin.ModelAdmin):
    """
    The forms to add and change login log instances.

    The fields to be used in displaying the Loginlog model.
    """

    list_display = ["username", "login_time", "login_browser", "login_ip", "login_host", "app_id"]
    search_fields = ["username"]
    list_filter = ["app_id"]


admin.site.register(Loignlog, LoignlogAdmin)
