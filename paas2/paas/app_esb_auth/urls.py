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

from common.constants import SAAS_CODE_REGEX
from app_esb_auth import views

urlpatterns = [
    # 组件权限申请首页
    url(r"^(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.home),
    # 通过组件系统名称获取该系统的api
    url(r"^get_esb_api/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$", views.get_esb_api),
    url(
        r"^esb_api_auth_apply/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$",
        views.esb_api_auth_apply,
    ),
    url(
        r"^esb_api_auth_batch_apply/(?P<app_code>" + SAAS_CODE_REGEX + ")/(?P<sys_name>[A-Za-z0-9_]+)/$",
        views.esb_api_auth_batch_apply,
    ),
]
