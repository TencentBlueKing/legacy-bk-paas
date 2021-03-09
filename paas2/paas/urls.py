# -*- coding: utf-8 -*-

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
from django.shortcuts import redirect
from django.http import HttpResponse
from django.views.i18n import javascript_catalog

from healthz import views as healthz_views


urlpatterns = [
    # 首页, 重定向到首页, pattern => /console/  permanent => 301
    url(r"^$", lambda _: redirect("/console/", permanent=True)),
    # 用户账号相关
    url(r"^accounts/", include("account.urls")),
    # admin
    url(r"^admin/", include(admin.site.urls)),
    # 服务器信息
    url(r"^engine/", include("engine.urls")),
    # 应用相关
    url(r"^app/", include("app.urls")),
    # 环境变量
    url(r"^app/env/", include("app_env.urls")),
    # SaaS 服务相关
    url(r"^saas/", include("saas.urls")),
    # 首页
    url(r"^platform/", lambda _: redirect("/console/", permanent=True)),
    # 发布相关
    url(r"^release/", include("release.urls")),
    # 下架
    url(r"^unrelease/", include("release.urls_unrelease")),
    # 指南
    url(r"^guide/", include("guide.urls")),
    # ESB
    url(r"^esb/", include("esb.configs.urls")),
    # 组件权限申请
    url(r"^esb_auth/", include("app_esb_auth.urls")),
    # API 相关
    url(r"^paas/api/", include("api.urls")),
    # 集成应用(第三方应用) 相关
    url(r"^tpapp/", include("tpapp.urls")),
    # 健康检查接口
    url(r"^healthz/", include("healthz.urls")),
    url(r"^ping/", healthz_views.ping),
    # 服务器信息
    url(r"^bksuite/", include("bksuite.urls")),
    # iam api
    url(r"^iam/api/", include("bk_iam.urls")),
    # 处理JS翻译
    url(r"^jsi18n/(?P<packages>\S+?)/$", javascript_catalog, name="javascript-catalog"),
    # 反搜索
    url(r"^robots\.txt$", lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
    url(r"^jsi18n/(?P<packages>\S+?)/$", javascript_catalog, name="javascript-catalog"),
]

if settings.EDITION == "ee":
    urlpatterns += [
        # 日志
        url(r"^log/", include("app_log.urls")),
        # 监控告警
        url(r"^monitor/", include("app_monitor.urls")),
        # 蓝鲸对象存储服务
        url(r"^storage/", include("storage.urls")),
        # 应用统计
        url(r"^app_analysis/", include("app_analysis.urls")),
    ]
else:
    urlpatterns += [
        # ce home
        # url(r'^platform/', include("home.urls")),
        url(r"^console/", include("home.urls")),
        # 个人中心 - 微信相关
        url(r"^console/user_center/", include("user_center.urls")),
    ]


# for upload/download
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from account.decorators import login_exempt  # noqa
import django.views  # noqa

static_serve = login_exempt(django.views.static.serve)
urlpatterns.append(url(r"^media/(?P<path>.*)$", static_serve, {"document_root": settings.MEDIA_ROOT}))

# download for default resources
urlpatterns.append(url(r"^download/(?P<path>.*)$", static_serve, {"document_root": settings.DOWNLOAD_ROOT}))

# for pormetheus metrics
from django_prometheus import exports  # noqa

urlpatterns.append(url(r"^metrics$", login_exempt(exports.ExportToDjangoView), name="prometheus-django-metrics"))


# for static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns  # noqa

urlpatterns += staticfiles_urlpatterns()
