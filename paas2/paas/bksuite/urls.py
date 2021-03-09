# -*- coding: utf-8 -*-
from django.conf.urls import url

from bksuite import views

urlpatterns = [
    # 版本信息
    url(r"^$", views.home),
]
