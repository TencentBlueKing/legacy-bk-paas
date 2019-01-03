# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""URL routing patterns for the Engine API.
"""
from django.conf.urls import url

from api import views

PVAR_IP_REGEX = r'(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}'
PVAR_APP_REGEX = '[a-z_0-9-]+'
PVAR_EVENT_ID_REGEX = '[a-f-_0-9]+'
PVAR_NAME_REGEX = '[a-z-_A-Z0-9]+'

urlpatterns = [

    url(r"^agents/$", views.AgentViewSet.as_view()),
    url(r"^agents/(?P<agent_ip>%s)/$" % PVAR_IP_REGEX, views.AgentViewSet.as_view()),
    url(r"^agents/(?P<server_id>\d+)/$", views.AgentActiveViewSet.as_view()),

    url(r"^apps/$", views.AppViewSet.as_view()),
    url(r"^apps/(?P<app_code>%s)/$" % PVAR_APP_REGEX, views.AppViewSet.as_view()),

    url(r"^apps/(?P<app_code>%s)/(?P<mode>(test)|(prod))/releases/$" % PVAR_APP_REGEX,
        views.AppReleaseViewSet.as_view()),

    url(r"^apps/(?P<app_code>%s)/events/(?P<event_id>%s)/logs/$" % (PVAR_APP_REGEX, PVAR_EVENT_ID_REGEX),
        views.AppLogsViewSet.as_view()),
    url(r"^apps/(?P<app_code>%s)/events/(?P<event_id>%s)/?" % (PVAR_APP_REGEX, PVAR_EVENT_ID_REGEX),
        views.AppEventLogsViewSet.as_view()),

    url(r"^healthz/$", views.HealthCheckView.as_view()),
    url(r"^agents/(?P<server_id>\d+)/healthz/$", views.AgentHealthCheckView.as_view()),

    url(r"^services/(?P<service_name>%s)/servers/(?P<server_id>\d+)/healthz/$" % PVAR_NAME_REGEX,
        views.ServiceHealthCheckView.as_view()),
    url(r"^services/(?P<service_name>%s)/servers/$" % PVAR_NAME_REGEX,
        views.ServiceServerViewSet.as_view()),
    url(r"^services/(?P<service_name>%s)/servers/(?P<server_id>\d+)/$" % PVAR_NAME_REGEX,
        views.ServiceServerViewSet.as_view())

]

# agent/init and rabbitmq/init will be deprecated
# use agents/(?P<agent_ip>%s)/ and services/(?P<service_name>%s)/server/(?P<server_ip>%s)/ instead
urlpatterns += [
    url(r"^agent/init/?", views.AgentRegistryView.as_view()),
    url(r"^rabbitmq/init/?", views.MqRegistryView.as_view())
]
