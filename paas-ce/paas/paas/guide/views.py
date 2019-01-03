# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings

from common.views.mako import MakoTemplateView
from engine.models import BkServer


class ServiceIntroductionView(MakoTemplateView):
    """服务介绍
    """
    template_name = 'guide/services.html'


class NewbieView(MakoTemplateView):
    """新手指南
    """
    template_name = 'guide/newbie.html'

    def get_context_data(self, **kwargs):
        context = super(NewbieView, self).get_context_data(**kwargs)

        paas_host = "{}://{}".format(settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)
        # 获取已激活的 AppServer 信息
        active_server_ip_list = BkServer.objects.get_active_server_ips()
        active_server_ips = ';'.join(active_server_ip_list)

        context.update({
            'paas_host': paas_host,
            'active_server_ips': active_server_ips
        })

        return context
