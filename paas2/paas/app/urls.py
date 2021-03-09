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
