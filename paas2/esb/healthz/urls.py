# -*- coding: utf-8 -*-

from django.conf.urls import url
from healthz import views, views_check_codename

urlpatterns = [
    url(r"^healthz/$", views.healthz),
    url(r"^ping/$", views.ping),
    url(r"^healthz/check_custom_codename/$", views_check_codename.check_custom_codename),
]
