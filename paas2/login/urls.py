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

from __future__ import unicode_literals

from django.conf.urls import include, url
from django.conf import settings
from django.http import HttpResponse
from django.views.i18n import javascript_catalog
from django.views import i18n as django_i18n_views
from decorator_include import decorator_include

from bkauth import views as auth_views
from healthz import views as healthz_views
from bkauth.decorators import login_exempt
from api import views as views_api


urlpatterns = [
    # 登录页面
    url(r"^$", auth_views.LoginView.as_view()),
    # 登录弹窗
    url(r"^plain/$", auth_views.LoginView.as_view(is_plain=True)),
    url(r"^logout/$", auth_views.LogoutView.as_view()),
    # oauth2
    url(r"^oauth/", decorator_include(login_exempt, "bk_oauth2.urls", namespace="oauth2_provider")),
    # ========================= the apis =========================
    # TODO: 所有get_all_user/get_batch_user api应该直接调用usermgr的esb接口或者后台接口, 不应该走login
    # please use api get_all_user/get_batch_user via esb, should not from login
    url(
        r"^accounts/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginView.as_view()),
                url(r"^get_user/$", views_api.UserView.as_view()),
            ]
        ),
    ),
    # 登录态验证接口保持与后台一致
    url(
        r"^login/accounts/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginView.as_view()),
                url(r"^get_user/$", views_api.UserView.as_view()),
            ]
        ),
    ),
    # 登陆模块 API，V2，线上
    url(
        r"^api/v2/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginViewV2.as_view()),
                url(r"^get_user/$", views_api.UserViewV2.as_view()),
            ]
        ),
    ),
    # 登陆模块 API，V2，本地
    url(
        r"^login/api/v2/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginViewV2.as_view()),
                url(r"^get_user/$", views_api.UserViewV2.as_view()),
            ]
        ),
    ),
    # 登陆模块 API，V3，线上
    url(
        r"^api/v3/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginViewV3.as_view()),
                url(r"^get_user/$", views_api.UserViewV3.as_view()),
            ]
        ),
    ),
    # 登陆模块 API，V3，本地
    url(
        r"^login/api/v3/",
        include(
            [
                url(r"^is_login/$", views_api.CheckLoginViewV3.as_view()),
                url(r"^get_user/$", views_api.UserViewV3.as_view()),
            ]
        ),
    ),
    # ========================= the apis =========================
    # 连通性检查
    url(r"^ping/$", healthz_views.ping),
    # 检查统一登录是否正常运行
    url(r"^healthz/", include("healthz.urls")),
    # bk_metadata
    url(r"^metadata/", include("metadata.urls")),
    # 反搜索
    url(r"^robots\.txt$", lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
    # prometheus metrics
    url(r"", decorator_include(login_exempt, "django_prometheus.urls", namespace="prometheus")),
]

# ce not support i18n, so no setlang and jsi18n
if settings.EDITION == "ee":
    urlpatterns += [
        # 无登录态下切换语言
        url(r"^i18n/setlang/$", django_i18n_views.set_language, name="set_language"),
        # 处理JS翻译
        url(r"^jsi18n/(?P<packages>\S+?)/$", javascript_catalog, name="javascript-catalog"),
    ]


from django.contrib.staticfiles.urls import staticfiles_urlpatterns  # noqa

urlpatterns += staticfiles_urlpatterns()
