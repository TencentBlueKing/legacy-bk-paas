# -*- coding: utf-8 -*-

from django.contrib import admin

from app.models import App, SecureInfo, AppTags


class AppAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "creater",
        "created_date",
        "state",
        "is_already_test",
        "is_already_online",
        "is_third",
        "is_saas",
        "is_platform",
        "is_default",
    )
    search_fields = ("name", "code", "creater")
    list_filter = ("creater", "created_date", "is_third", "is_saas", "is_platform", "is_default")


admin.site.register(App, AppAdmin)


class SecureInfoAdmin(admin.ModelAdmin):
    list_display = ("app_code", "vcs_type", "vcs_url", "vcs_username")
    search_fields = ("app_code",)
    list_filter = ("vcs_type",)
    exclude = (
        "vcs_url",
        "vcs_username",
        "vcs_password",
        "db_host",
        "db_port",
        "db_name",
        "db_username",
        "db_password",
    )


admin.site.register(SecureInfo, SecureInfoAdmin)


class AppTagsAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "index")
    search_fields = ("code", "name")


admin.site.register(AppTags, AppTagsAdmin)
