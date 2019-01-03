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

from bkaccount import views, views_api


urlpatterns = [
    # 用户信息相关
    url(r'^user/', include([
        # 用户管理
        url(r'^list/', include([
            url(r'^$', views.UserPageView.as_view()),
            url(r'^query/$', views.UserListPage.as_view()),
        ])),
        # [post] user create
        url(r'^$', views.UserView.as_view()),
        # [put/delete] userinfo modify / user delete
        url(r'^(?P<user_id>\d+)/$', views.UserView.as_view()),
        # [put] user password
        url(r'^(?P<user_id>\d+)/password/$', views.UserPasswordView.as_view()),
        # export/import users
        url(r'^export/$', views.UserExportView.as_view()),
        url(r'^import/$', views.UserImportView.as_view()),

        # API for user center in paas with bktoken cookies
        # [put] user password reset
        url(r'^password/$', views_api.CurrentUserPasswordView.as_view()),
        # [post] user info modify
        url(r'^baseinfo/$', views_api.CurrentUserBaseInfoView.as_view()),
        # [post/delete] weixin user_id bind/unbind
        url(r'^weixin_info/$', views_api.CurrentUserWeixinInfoView.as_view()),
    ])),

    # API 接口
    url(r'^is_login/$', views_api.CheckLoginView.as_view()),
    url(r'^get_user/$', views_api.UserView.as_view()),
    url(r'^get_all_user/$', views_api.AllUsersView.as_view()),
    url(r'^get_batch_user/$', views_api.BatchUsersView.as_view()),
]
