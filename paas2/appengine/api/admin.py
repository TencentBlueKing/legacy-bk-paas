from django.contrib import admin

from api.models import BkServer


class BkServerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "s_id", "token", "ip_address", "ip_port", "category", "is_active")
    search_fields = ("name",)
    list_filter = ("name", "created_at")


admin.site.register(BkServer, BkServerAdmin)
