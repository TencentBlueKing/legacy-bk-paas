# -*- coding: utf-8 -*-
from django.conf.urls import url

from common.constants import APP_CODE_REGEX, SAAS_CODE_REGEX
from app import views

urlpatterns = [
    # app list
    url(r"^list/$", views.app_list, name="app_list"),
    url(r"^query_list/$", views.query_app_list),
    # create app
    url(r"^create/$", views.create_app),
    url(r"^modify/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.modify_app),
    url(r"^modify_app_logo/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.modify_app_logo),
    # 获取APP分类信息
    url(r"^get_apptags/$", views.get_apptags),
    # 校验
    url(r"^check_app_code/$", views.check_app_code),
    url(r"^check_app_name/$", views.check_app_name),
    # app基本信息
    url(r"^info/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.info),
    url(r"^status/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.app_status),
    url(r"^get_vcs_password/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.get_vcs_password),
    # 错误提示信息
    # url(r'^error/(?P<error_id>\d+)/(?P<app_code>' + SAAS_CODE_REGEX + ')/$', views.error),
    # 激活码申请流程
    url(r"^show_apply_process/$", views.show_apply_process),
]
