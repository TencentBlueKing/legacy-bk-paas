# -*- coding: utf-8 -*-
from django.conf.urls import url

from engine import views

urlpatterns = [
    # 应用服务器信息
    url(r"^servers/$", views.servers, name="servers"),
    url(r"^add_server_info/$", views.add_server_info, name="add_server_info"),
    url(r"^del_server_info/$", views.del_server_info, name="del_server_info"),
    url(r"^active_server/$", views.active_server, name="active_server"),
    url(r"^refresh_server/$", views.refresh_server, name="refresh_server"),
    # 第三方服务信息
    url(r"^third_servers/$", views.third_servers, name="third_servers"),
    url(r"^add_third_server_info/$", views.add_third_server_info, name="add_third_server_info"),
    url(r"^del_third_server_info/$", views.del_third_server_info, name="del_third_server_info"),
    url(r"^active_third_server/$", views.active_third_server, name="active_third_server"),
    url(r"^refresh_third_server/$", views.refresh_third_server, name="refresh_third_server"),
]
