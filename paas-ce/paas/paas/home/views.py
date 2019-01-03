# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.views.generic import View

from common.responses import OKJsonResponse
from common.views.mako import MakoTemplateView
from home.constants import INDEX_FIRST_SHOW_APPS_COUNT
from home.models import UsefulLinks, UserSettings
from home.utils import get_user_apps
from user_center.weixin.utils import get_user_wx_info


class IndexView(MakoTemplateView):
    """站点首页
    """
    template_name = 'home/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        request = self.request

        username = request.user.username

        user_app_list = get_user_apps(username)
        user_app_count = len(user_app_list)

        # 获取常用链接
        links = UsefulLinks.objects.get_common_links()
        # 首次显示应用的个数
        # 微信相关
        wx_type, wx_userid = get_user_wx_info(request)
        context.update({
            'wx_type': wx_type,
            'wx_userid': wx_userid,
            'links': links,
            'user_app_count': user_app_count,
            'first_show_count': INDEX_FIRST_SHOW_APPS_COUNT,
            'user_app_list': user_app_list
        })
        return context


class UpdateUserAppView(View):
    """更新用户的应用列表位置
    """
    http_method_names = ['post']

    def post(self, request):
        username = request.user.username
        apps = request.POST.get('apps')
        if apps:
            UserSettings.objects.filter(username=username).update(apps=apps)
        return OKJsonResponse("排序成功")
