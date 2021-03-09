# -*- coding: utf-8 -*-
from django.conf.urls import url

from common.constants import SAAS_CODE_REGEX
from tpapp import views


urlpatterns = [
    # 应用列表
    url(r"^list/$", views.tpapp_list_page, name="tpapp_list"),
    url(r"^query_list/$", views.query_app_list),
    # 应用基本信息
    url(r"^create/$", views.create_app),
    url(r"^info/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.info),
    # 应用部署
    url(r"^release/online/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.online_page),
    url(r"^release/offline/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.offline_page),
    url(r"^release/record/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.record_page),
    url(r"^release/task_excute/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.release_task_excute),
    url(r"^release/record_list/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<operate_code>\d)/$", views.get_record_list),
]
