# -*- coding: utf-8 -*-
from django import forms
from django.contrib import admin

from home.constants import LinkTypeEnum
from home.models import UsefulLinks, UserSettings


# Register your models here.
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("username", "apps")
    search_fields = ("username",)
    list_filter = ("username",)


admin.site.register(UserSettings, UserSettingsAdmin)


class UsefulLinksForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(UsefulLinksForm, self).clean()
        if cleaned_data.get("link_type") == LinkTypeEnum.SAAS.value and not cleaned_data.get("logo"):
            raise forms.ValidationError("选择 SaaS 类型的链接必须上传 Logo")

    class Meta:
        model = UsefulLinks
        fields = "__all__"


class UsefulLinksAdmin(admin.ModelAdmin):
    list_display = ("name", "link", "link_type", "is_active")
    search_fields = ("name",)
    list_filter = ("name",)

    form = UsefulLinksForm


admin.site.register(UsefulLinks, UsefulLinksAdmin)
