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

from django.conf import settings
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter(trailing_slash=False)

# Add the generated REST URLs

urlpatterns = [
    url(r"^healthz/?", views.HealthCheckView.as_view()),
    url(r"^ping/$", views.PingView.as_view()),
    url(r"^agents/healthz$", views.AgentHealthCheckView.as_view()),
    url(r"^services/(?P<service_name>[a-z-_A-Z0-9]+)/check/?", views.ServiceViewSet.as_view({"get": "check_status"})),
    url(r"^apps/init/?$", views.AppViewSet.as_view({"post": "init"})),
    url(r"^apps/(?P<app_code>{})/info/?".format(settings.APP_URL_REGEX), views.AppViewSet.as_view({"get": "info"})),
    url(
        r"^apps/(?P<app_code>{})/releases/?".format(settings.APP_URL_REGEX),
        views.AppReleasesViewSet.as_view({"post": "releases", "delete": "destroy"}),
    ),
    url(
        r"^apps/(?P<app_code>{})/events/(?P<event_id>[a-z-_A-Z0-9]+)/logs/?".format(settings.APP_URL_REGEX),
        views.AppLogViewSet.as_view({"get": "logs"}),
    ),
    url(
        r"^apps/(?P<app_code>{})/events/(?P<event_id>[a-z-_A-Z0-9]+)/?".format(settings.APP_URL_REGEX),
        views.AppEventLogViewSet.as_view({"post": "create"}),
    ),
    url(r"^servers/(?P<server_id>\d+)/?", views.BkServersViewSet.as_view()),
]

urlpatterns += [
    url(r"^agent/init/?", views.AgentRegistryView.as_view()),
    url(r"^rabbitmq/init/?", views.MqRegistryView.as_view()),
]
