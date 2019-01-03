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
from django.conf.urls import include

from engine import views

urlpatterns = [
    # 应用服务器信息
    url(r'^server/', include([
        url(r'^$', views.ServerView.as_view(), name="engine_server"),
        url(r'^(?P<server_id>\d+)/$', views.ServerDetailView.as_view(), name="engine_server_detail"),

        url(r'^active/$', views.ActivateServerView.as_view(), name='active_server'),
        url(r'^refresh/$', views.RefreshServerView.as_view(), name='refresh_server'),
    ])),

    # 第三方服务信息third_servers
    url(r'^external_server/', include([
        url(r'^$', views.ExternalServerView.as_view(), name="external_server"),
        url(r'^(?P<server_id>\d+)/$', views.ExternalServerDetailView.as_view(),
            name="external_server_detail"),

        url(r'^active/$', views.ActivateExternalServerView.as_view(), name='active_third_server'),
        url(r'^refresh/$', views.RefreshExternalServerView.as_view(), name='refresh_third_server'),
    ])),

]
