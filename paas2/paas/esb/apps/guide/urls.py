# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views


urlpatterns = [
    url(r"^page/index/$", views.Page.as_view(), {"name": "esb_introduction"}, name="guide.page.index"),
    url(r"^page/(?P<name>\w+)$", views.Page.as_view(), name="guide.page"),
]
