# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django.conf.urls import url

from .index import views
from .channel import views as channel_views, api_views as api_channel_views
from .system import views as system_views, api_views as api_system_views
from .buffet_comp import views as buffet_comp_views, api_views as api_buffet_views
from common.decorators import escape_exempt


urlpatterns = [
    # index
    url(r'^index/$', escape_exempt(views.IndexView.as_view()), name='manager.index'),


    # channel
    url(r'^channel/list/$', escape_exempt(channel_views.ChannelListView.as_view()), name='manager.channel.list'),
    url(r'^channel/add/$', escape_exempt(channel_views.AddChannelView.as_view()), name='manager.channel.add'),
    # 为方便js字符替换，将channel_id设置为支持任意字符，在方法内部校验其为整数
    url(r'^channel/(?P<channel_id>\w+)/edit/$',
        escape_exempt(channel_views.EditChannelView.as_view()),
        name='manager.channel.edit'),
    url(r'^channel/deleted/$',
        escape_exempt(api_channel_views.DeletedChannelView.as_view()),
        name='manager.channel.deleted'),
    # API View
    url(r'^api/channel/list/$',
        escape_exempt(api_channel_views.ChannelListSearchView.as_view()),
        name='manager.api.channel.list'),

    # system
    url(r'^system/list/$', escape_exempt(system_views.SystemListView.as_view()), name='manager.system.list'),
    url(r'^system/add/$', escape_exempt(system_views.AddSystemView.as_view()), name='manager.system.add'),
    url(r'^system/(?P<system_id>\d+)/edit/$',
        escape_exempt(system_views.EditSystemView.as_view()),
        name='manager.system.edit'),

    # API Views
    url(r'^system/deleted/$',
        escape_exempt(api_system_views.DeletedSystemView.as_view()),
        name='manager.system.deleted'),
    url(r'^api/system/add/$', escape_exempt(api_system_views.AddSystemView.as_view()), name='manager.api.system.add'),


    # buffet component
    url(r'^buffet_comp/apply/$',
        escape_exempt(buffet_comp_views.ApplyBuffetCompView.as_view()),
        name='manager.buffet_comp.apply'),
    url(r'^buffet_comp/list/$',
        escape_exempt(buffet_comp_views.BuffetCompsView.as_view()),
        name='manager.buffet_comp.list'),
    url(r'^buffet_comp/(?P<item_id>\d+)/edit/$',
        escape_exempt(buffet_comp_views.EditBuffetCompView.as_view()),
        name='manager.buffet_comp.edit'),
    # Mappings
    url(r'^buffet_comp/mapping/list/$',
        escape_exempt(buffet_comp_views.BuffetMappingsView.as_view()),
        name='manager.buffet_comp.mapping.list'),

    # API Views
    url(r'^api/buffet_comp/mappings/$',
        escape_exempt(api_buffet_views.APIBuffetMappingView.as_view()),
        name='manager.api.buffet_comp.mapping.list'),
    url(r'^api/buffet_comp/mappings/(?P<item_id>\d+)/$',
        escape_exempt(api_buffet_views.APIBuffetMappingView.as_view()),
        name='manager.api.buffet_comp.mapping'),
]
