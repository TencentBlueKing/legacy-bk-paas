# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""


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
