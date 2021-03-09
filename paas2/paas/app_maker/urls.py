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

from app_maker import views

urlpatterns = [
    # 创建轻应用
    url(r"^app/create/$", views.create_app),
    # 修改轻应用信息
    url(r"^app/edit/$", views.edit_app),
    # 修改轻应用logo
    url(r"^app_logo/modify/$", views.modify_app_logo),
    # 删除轻应用
    url(r"^app/del/$", views.del_app),
]
