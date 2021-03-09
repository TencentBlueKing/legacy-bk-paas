# -*- coding: utf-8 -*-
from django.conf.urls import url, include

from api import views, views_v2 as api_view2

from app_maker import views_v2 as app_maker_view_v2

urlpatterns = [
    # 给标准运维提供的创建轻应用相关接口
    url(r"^app_maker/", include("app_maker.urls")),
    # 应用基本信息API(已接入ESB)
    url(r"^app_info/$", views.get_app_info),
    # 轻应用相关接口，V2
    url(r"^v2/app_info/$", api_view2.get_app_info),
    url(r"^v2/modify_app_logo/$", app_maker_view_v2.modify_app_logo),
    url(r"^v2/edit_app/$", app_maker_view_v2.edit_app),
    url(r"^v2/del_app/$", app_maker_view_v2.del_app),
    url(r"^v2/create_app/$", app_maker_view_v2.create_app),
]
