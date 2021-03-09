# -*- coding: utf-8 -*-
from django.contrib import admin

from desktop.models import UserSettings, UserApp, Wallpaper


class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "appxy", "dockpos", "skin", "wallpaper_id", "wallpaper_type")
    search_fields = ("user__username",)
    list_filter = ("user",)


admin.site.register(UserSettings, UserSettingsAdmin)


class UserAppAdmin(admin.ModelAdmin):
    list_display = ("user", "app", "desk_app_type", "app_position", "add_time")
    search_fields = ("user__username", "app__name", "app__code")
    list_filter = ("app", "user")


admin.site.register(UserApp, UserAppAdmin)


class WallpaperAdmin(admin.ModelAdmin):
    list_display = ("name", "number", "width", "height", "is_default")
    search_fields = ("name",)
    list_filter = ("is_default",)


admin.site.register(Wallpaper, WallpaperAdmin)
