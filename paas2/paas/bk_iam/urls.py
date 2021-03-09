# -*- coding: utf-8 -*-

from django.conf.urls import url

from bk_iam import views

urlpatterns = [
    url(r"^v1/resources/$", views.resources),
]
