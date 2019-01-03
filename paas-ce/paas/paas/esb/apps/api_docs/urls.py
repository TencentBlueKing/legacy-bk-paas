# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.conf.urls import url

from . import views, api_views


urlpatterns = [
    url(r'^$', views.Index.as_view(), name='esb_api_docs'),

    url(r'^system/$', views.Index.as_view(), name='esb_api_docs'),
    url(r'^system/(?P<system_name>\w+)/$', views.ApiInfoBySystem.as_view(), name='api_info_by_system'),
    url(r'^system/(?P<system_name>\w+)/(?P<api_name>\w+)/$', views.ApiDocByApiName.as_view(),
        name='api_doc_by_api_name'),

    url(r'^api/all_api/$', api_views.AllApi.as_view(), name='api.all_api'),
    url(r'^api/(?P<system_name>\w+)/apis/$', api_views.GetApisBySystem.as_view(), name='api.get_apis_by_system'),
    url(r'^api/(?P<system_name>\w+)/(?P<api_id>\w+)/docs/$', api_views.GetApiDocByApiId.as_view(),
        name='api.get_api_doc_by_api'),
    url(r'^api/submit_the_advice/$', api_views.SubmitTheAdvice.as_view(), name='api.submit_the_advice'),
    url(r'^api/check_component_exist/$', api_views.CheckComponentExist.as_view(), name='api.check_component_exist'),
    url(r'^api/system_doc_category/$', api_views.GetSystemDocCategory.as_view(), name='api.get_system_doc_category'),


    url(r'^translate/test/$', views.TranslateTest.as_view(), name='translate_test'),
]
