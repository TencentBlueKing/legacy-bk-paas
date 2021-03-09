# -*- coding: utf-8 -*-

from django.contrib import admin

from audit.models import AuditEventLog


class AuditEventLogAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    # def has_change_permission(self, request, obj=None):
    #     return False

    def has_delete_permission(self, request, obj=None):
        return False

    readonly_fields = AuditEventLog._meta.get_all_field_names()


admin.site.register(AuditEventLog, AuditEventLogAdmin)
