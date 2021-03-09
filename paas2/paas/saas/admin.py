# -*- coding: utf-8 -*-

from django.contrib import admin

from saas.models import SaaSApp, SaaSAppVersion, SaaSUploadFile


class SaaSAppAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "created_time", "current_version", "current_test_version")
    search_fields = ("name", "code")
    list_filter = ("code",)


admin.site.register(SaaSApp, SaaSAppAdmin)


class SaaSAppVersionAdmin(admin.ModelAdmin):
    list_display = ("version", "saas_app", "upload_file", "updated_at")
    search_fields = ("version", "saas_app")
    list_filter = ("saas_app__code", "saas_app__name")


admin.site.register(SaaSAppVersion, SaaSAppVersionAdmin)


class SaaSUploadFileAdmin(admin.ModelAdmin):
    list_display = ("name", "size", "md5", "uploaded_at")
    search_fields = ("name", "size", "md5")
    exclude = ("file",)


admin.site.register(SaaSUploadFile, SaaSUploadFileAdmin)
