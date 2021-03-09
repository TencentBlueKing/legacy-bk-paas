# -*- coding: utf-8 -*-


from django.conf.urls import url

from guide import views

urlpatterns = [
    # 服务介绍
    url(r"^services/$", views.services),
    # 新手指南
    url(r"^newbie/$", views.newbie),
]
