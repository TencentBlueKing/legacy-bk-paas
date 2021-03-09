# -*- coding: utf-8 -*-

from django.conf.urls import url

from common.constants import SAAS_CODE_REGEX
from app_esb_auth import views

urlpatterns = [
    # 组件权限申请首页
    url(r"^(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.home),
    # 通过组件系统名称获取该系统的api
    url(r"^get_esb_api/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$", views.get_esb_api),
    url(
        r"^esb_api_auth_apply/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$",
        views.esb_api_auth_apply,
    ),
    url(
        r"^esb_api_auth_batch_apply/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$",
        views.esb_api_auth_batch_apply,
    ),
]
