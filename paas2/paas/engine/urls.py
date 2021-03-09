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

from django.conf.urls import url

from engine import views

urlpatterns = [
    # 应用服务器信息
    url(r"^servers/$", views.servers, name="servers"),
    url(r"^add_server_info/$", views.add_server_info, name="add_server_info"),
    url(r"^del_server_info/$", views.del_server_info, name="del_server_info"),
    url(r"^active_server/$", views.active_server, name="active_server"),
    url(r"^refresh_server/$", views.refresh_server, name="refresh_server"),
    # 第三方服务信息
    url(r"^third_servers/$", views.third_servers, name="third_servers"),
    url(r"^add_third_server_info/$", views.add_third_server_info, name="add_third_server_info"),
    url(r"^del_third_server_info/$", views.del_third_server_info, name="del_third_server_info"),
    url(r"^active_third_server/$", views.active_third_server, name="active_third_server"),
    url(r"^refresh_third_server/$", views.refresh_third_server, name="refresh_third_server"),
]
