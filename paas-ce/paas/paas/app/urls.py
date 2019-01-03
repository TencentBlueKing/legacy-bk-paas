# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf.urls import include, url

from app import views
from app_env import views as app_env_views
from common.constants import SAAS_CODE_REGEX

urlpatterns = [
    # 创建应用 and create error
    url(r'^$', views.CreateAppView.as_view()),
    url(r'^error/$', views.CreateAppView.as_view()),

    # 应用列表
    url(r'^list/', include([
        url(r'^$', views.AppListPageView.as_view(), name="app_list"),
        url(r'^query/$', views.AppListView.as_view()),
    ])),

    # 校验
    url(r'^check/', include([
        url(r'^app_code/$', views.CheckAppCodeView.as_view(), name='check_app_code'),
        url(r'^app_name/$', views.CheckAppNameView.as_view(), name='check_app_name'),
    ])),


    # app基本信息, use SAAS_CODE_REGEX for both app and saas
    url(r'^(?P<app_code>' + SAAS_CODE_REGEX + ')/', include([
        # update app
        url(r'^$', views.ModifyAppView.as_view()),
        # update logo
        url(r'^logo/$', views.ModifyAppLogoView.as_view()),

        url(r'^info/$', views.AppInfoView.as_view()),
        url(r'^status/$', views.AppStatusView.as_view()),
        url(r'^vcs/password/$', views.VCSPasswordView.as_view()),
        # error tip
        url(r'^error/(?P<error_id>\d+)/$', views.ErrorView.as_view()),

        url(r'^env/', include([
            # get/post
            url(r'^$', app_env_views.AppEnvView.as_view()),
            # put/delete
            url(r'^(?P<var_id>\d+)/$', app_env_views.AppEnvView.as_view()),
        ])),

    ])),

]
