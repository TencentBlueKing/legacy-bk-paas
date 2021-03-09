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
