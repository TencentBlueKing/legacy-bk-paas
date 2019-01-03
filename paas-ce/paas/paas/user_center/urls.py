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

from user_center import views

# 统计应用
urlpatterns = [
    url(r'^weixin/', include([
        # 微信公众号
        url(r'^mp/', include([
            url(r'^get_qrcode/$', views.get_qrcode_by_mp),
            url(r'^callback/$', views.weixin_mp_callback),
        ])),

        # 微信企业号/企业微信
        url(r'^qy/', include([
            url(r'^get_login_url/$', views.get_login_url_by_qy),
            url(r'^login_callback/$', views.weixin_qy_login_callback),
        ])),

        # 查询绑定状态
        url(r'^get_bind_status/$', views.get_bind_status),

        # 解绑用户微信信息
        url(r'^unbind_wx_user_info/$', views.unbind_wx_user_info),
    ])),
]
