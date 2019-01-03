# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""paas URL Configuration

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
"""

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.http import HttpResponse
from django.views.generic import RedirectView
from django.views.i18n import javascript_catalog


urlpatterns = [
    # 首页, 重定向到首页, pattern => /platform/  permanent => 301
    url(r'^$', RedirectView.as_view(pattern_name="platform", permanent=True)),
    # 首页
    url(r'^platform/', include("home.urls")),

    # 用户账号相关
    url(r'^accounts/', include("account.urls")),

    # 服务器信息
    url(r'^engine/', include("engine.urls")),

    # 应用相关
    url(r'^app/', include("app.urls")),

    # SaaS 服务相关
    url(r'^saas/', include("saas.urls")),

    # 发布相关
    url(r'^release/', include("release.urls")),

    # 资源下载
    url(r'^resource/', include("resource.urls")),
    # 指南
    url(r'^guide/', include("guide.urls")),

    # API 相关
    url(r'^paas/api/', include("api.urls")),
    # ESB
    url(r'^esb/', include("esb.configs.urls")),
    # 服务检测
    url(r'^healthz/', include("healthz.urls")),

    # 个人中心 - 微信相关
    url(r'^console/user_center/', include("user_center.urls")),

    # admin
    url(r'^admin/', include(admin.site.urls)),

    # 反搜索
    url(r'^robots\.txt$', lambda r: HttpResponse('User-agent: *\nDisallow: /', content_type='text/plain')),

    # i18n
    url(r'^jsi18n/(?P<packages>\S+?)/$', javascript_catalog, name='javascript-catalog'),
]

# for upload/download
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from account.decorators import login_exempt  # noqa
import django.views  # noqa
static_serve = login_exempt(django.views.static.serve)
urlpatterns.append(url(r'^media/(?P<path>.*)$', static_serve, {'document_root': settings.MEDIA_ROOT}))


# for static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns  # noqa
urlpatterns += staticfiles_urlpatterns()
