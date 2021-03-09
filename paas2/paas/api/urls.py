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

from django.conf.urls import url, include

from api import views, views_v2 as api_view2

from app_maker import views_v2 as app_maker_view_v2

urlpatterns = [
    # 给标准运维提供的创建轻应用相关接口
    url(r"^app_maker/", include("app_maker.urls")),
    # 应用基本信息API(已接入ESB)
    url(r"^app_info/$", views.get_app_info),
    # 轻应用相关接口，V2
    url(r"^v2/app_info/$", api_view2.get_app_info),
    url(r"^v2/modify_app_logo/$", app_maker_view_v2.modify_app_logo),
    url(r"^v2/edit_app/$", app_maker_view_v2.edit_app),
    url(r"^v2/del_app/$", app_maker_view_v2.del_app),
    url(r"^v2/create_app/$", app_maker_view_v2.create_app),
]
