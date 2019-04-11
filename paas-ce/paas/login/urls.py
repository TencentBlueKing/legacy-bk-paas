# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

paas URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
""" # noqa

from __future__ import unicode_literals

from bkaccount import views, views_api_v2

from django.conf.urls import include, url
from django.http import HttpResponse
from django.views.i18n import javascript_catalog
from django.views import i18n as django_i18n_views


base_urlpatterns = [
    # 登录页面
    url(r'^$', views.LoginView.as_view()),
    url(r'^logout/$', views.LogoutView.as_view()),
    # 用户管理
    url(r'^accounts/', include("bkaccount.urls")),

    # 登陆模块 API，V2
    url(r'^api/v2/is_login/$', views_api_v2.CheckLoginView.as_view()),
    url(r'^api/v2/get_user/$', views_api_v2.UserView.as_view()),
    url(r'^api/v2/get_batch_users/$', views_api_v2.BatchUsersView.as_view()),
    url(r'^api/v2/get_all_users/$', views_api_v2.AllUsersView.as_view()),
]

urlpatterns = [
    url(r'^', include(base_urlpatterns)),
    # 支持本地开发
    url(r'^login/', include(base_urlpatterns)),
    # 检查统一登录是否正常运行
    url(r'^healthz/', include("healthz.urls")),
    # 反搜索
    url(r'^robots\.txt$', lambda r: HttpResponse('User-agent: *\nDisallow: /', content_type='text/plain')),

    # 无登录态下切换语言
    url(r'^i18n/setlang/$', django_i18n_views.set_language, name='set_language'),
    # 处理JS翻译
    url(r'^jsi18n/(?P<packages>\S+?)/$', javascript_catalog, name='javascript-catalog'),
]

from django.contrib.staticfiles.urls import staticfiles_urlpatterns  # noqa
urlpatterns += staticfiles_urlpatterns()
