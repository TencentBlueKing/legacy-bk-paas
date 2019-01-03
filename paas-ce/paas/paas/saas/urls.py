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

from common.constants import SAAS_CODE_REGEX
from saas import views

urlpatterns = [

    # 应用列表
    url(r'^list/', include([
        url(r'^$', views.SaaSListPageView.as_view(), name="saas_list"),
        url(r'^query/$', views.SaaSListView.as_view()),
    ])),

    # 应用基本信息
    url(r'^(?P<app_code>' + SAAS_CODE_REGEX + ')/', include([
        url(r'^info/$', views.InfoView.as_view()),
        # FIXME: change to restful-like api if more action on saas
        # 删除SaaS应用
        url(r'^delete/$', views.DeleteSaaSView.as_view()),

        url(r'^logo/$', views.ModifyAppLogoView.as_view()),

        # 上传SaaS应用
        url(r'^upload/$', views.UploadView.as_view()),

        # 发布相关
        # 发布部署页面
        url(r'^release/', include([
            url(r'^$', views.ReleasePageView.as_view()),

            # 发布记录页面
            url(r'^record/$', views.RecordView.as_view()),

            # 下架页面
            url(r'^offline/$', views.OfflinePageView.as_view()),

            # 执行发布
            url(r'^online/(?P<saas_app_version_id>\d+)/$', views.OnlineView.as_view()),
        ])),

    ])),

    url(r'^0/release/$', views.ReleasePageView.as_view(), {'app_code': 0}),

    # for legency system,  keep below
    # saas/release/online,
    # saas/upload,
    url(r'^release/online/(?P<saas_app_version_id>\d+)/$', views.OnlineView.as_view()),
    url(r'^upload/(?P<app_code>' + SAAS_CODE_REGEX + ')/$', views.UploadView.as_view()),
]
