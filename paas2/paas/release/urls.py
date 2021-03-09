# -*- coding: utf-8 -*-

from django.conf.urls import url

from common.constants import APP_CODE_REGEX, SAAS_CODE_REGEX
from release import views

urlpatterns = [
    # 发布部署
    url(r"^(?P<app_code>" + APP_CODE_REGEX + ")/$", views.home),
    url(r"^get_deploy_page/(?P<page_type>\w+)/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.get_deploy_page),
    # 提测
    url(r"^test/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.release_test),
    # 上线
    url(r"^online/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.release_online),
    # 下架
    url(r"^outline/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.release_outline),
    # 删除
    url(r"^delete/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.release_delete),
    # 轮询查询状态
    url(r"^get_app_poll_task/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.get_event_status),
    url(r"^get_app_poll_task0/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.get_event_status_from_backend),
    # 查询未完成任务的状态, 更新数据库
    url(r"^check_unfinished_task/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.check_unfinished_task),
    # 页面刷新后, 重入时, 展示状态并且开启轮询
    url(r"^get_last_release_record/(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.get_last_release_record),
    # 发布记录
    url(r"^record/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.record),
    url(r"^get_app_record/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<operate_code>\d)/$", views.get_app_record),
    # 版本记录
    url(r"^version/(?P<app_code>" + APP_CODE_REGEX + ")/$", views.version),
]
