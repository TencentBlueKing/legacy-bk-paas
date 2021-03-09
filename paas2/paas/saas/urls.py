# -*- coding: utf-8 -*-
from django.conf.urls import url

from common.constants import SAAS_CODE_REGEX
from saas import views
from saas import deploy

urlpatterns = [
    # 应用列表
    url(r"^list/$", views.saas_list_page, name="saas_list"),
    url(r"^query_list/$", views.query_app_list),
    # 应用基本信息
    url(r"^info/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.info),
    url(r"^modify_app_logo/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.modify_app_logo),
    # 应用部署
    url(r"^release/upload/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.upload_page),
    url(r"^upload/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.do_upload),
    url(r"^upload0/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.do_upload_from_backend),
    url(r"^release/upload/version_list/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.version_list),
    url(r"^release/online/(?P<saas_app_version_id>\d+)/$", views.do_online),
    url(r"^release/online0/(?P<saas_app_version_id>\d+)/$", views.do_online_from_backend),
    url(r"^release/online/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.online_page),
    url(r"^release/online/env/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.online_env),
    url(r"^release/offline/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.offline_page),
    url(r"^release/offline/env/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.offline_env),
    url(r"^delete/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.do_delete),
    # 发布记录
    url(r"^release/record/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.record_page),
    # 部署应用API
    url(r"^deploy_app/$", deploy.deploy_app),
    url(r"^query_deploy_status/$", deploy.query_deploy_status),
]
