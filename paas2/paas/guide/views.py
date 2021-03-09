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


from django.conf import settings
from common.mymako import render_mako_context
from engine.models import BkServer


def services(request):
    """
    服务介绍
    """
    return render_mako_context(request, "guide/services.html", {})


def newbie(request):
    """
    新手指南
    """
    paas_host = "{}://{}".format(settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)
    # 获取已激活的 AppServer 信息
    active_servers = BkServer.objects.filter(is_active=True)
    active_server_ips = active_servers.values_list("ip_address", flat=True)
    active_server_ips = ";".join(set(active_server_ips))
    return render_mako_context(
        request, "guide/newbie.html", {"paas_host": paas_host, "active_server_ips": active_server_ips}
    )
