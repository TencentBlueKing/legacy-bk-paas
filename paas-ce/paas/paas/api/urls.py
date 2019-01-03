# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf.urls import url

from api import views


urlpatterns = [
    # 应用基本信息API(已接入ESB)
    url(r'^app_info/$', views.AppInfoAPIView.as_view()),
    url(r'^v2/app_info/$', views.AppInfoV2APIView.as_view()),

    # please use the new apis below
    # after format
    url(r'^v2/app/info/$', views.AppInfoV2APIView.as_view()),

]
