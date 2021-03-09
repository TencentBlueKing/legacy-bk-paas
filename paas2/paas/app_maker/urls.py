# -*- coding: utf-8 -*-
from django.conf.urls import url

from app_maker import views

urlpatterns = [
    # 创建轻应用
    url(r"^app/create/$", views.create_app),
    # 修改轻应用信息
    url(r"^app/edit/$", views.edit_app),
    # 修改轻应用logo
    url(r"^app_logo/modify/$", views.modify_app_logo),
    # 删除轻应用
    url(r"^app/del/$", views.del_app),
]
