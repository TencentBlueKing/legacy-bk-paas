# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.views.generic import View
from django.conf import settings

from esb.bkcore.models import ESBChannel
from esb.common.django_utils import JsonResponse
from esb.common.decorators import is_user_super

DEFAULT_HOST = 'http://paas.bking.com'


class DeletedChannelView(View):
    """Deleted channel view"""

    @is_user_super
    def post(self, request):
        channel_ids = request.POST.get('channel_ids')
        channel_ids = channel_ids.split(',') if channel_ids else []
        objs = ESBChannel.objects.filter(id__in=channel_ids)
        affected_rows = objs.count()
        objs.delete()
        return JsonResponse({'affected_rows': affected_rows, 'error_message': None})


class ChannelListSearchView(View):
    """根据过滤条件，筛选数据"""

    @is_user_super
    def get(self, request):
        system_name = request.GET.get('system_name')
        channel_path = request.GET.get('channel_path')
        # channel_name = request.GET.get('channel_name')
        channels = ESBChannel.objects.all()
        if system_name:
            channels = channels.filter(component_system__name=system_name)
        # if channel_name:
        #     channels = channels.filter(name__contains=channel_name)
        if channel_path:
            channels = channels.filter(path__contains=channel_path)

        # 获取HOST
        try:
            host = settings.PAAS_DOMAIN
        except Exception:
            host = DEFAULT_HOST
        try:
            schema = settings.HTTP_SCHEMA
        except Exception:
            schema = "http"

        schema_prefix = '%s://' % schema
        if not host.startswith(schema_prefix):
            host = '%s://%s' % (schema, host)

        channels = [
            {
                'id': channel.id,
                'name': channel.name_display,
                'label': u'[%s] %s' % (channel.component_system.name, channel.name_display),
                'path': channel.path,
                'method': channel.method,
                'component_codename': channel.component_codename,
                'is_active': channel.is_active,
                'created_time': channel.created_time.strftime('%Y-%m-%d'),
                'last_modified_time': channel.last_modified_time.strftime('%Y-%m-%d'),
                'timeout_time': channel.timeout_time,
                'host': '%s/api/c/compapi' % host,
                'perm_level_label': channel.get_perm_level_display(),
                'rate_limit_required': channel.rate_limit_required,
                'static_url': settings.STATIC_URL,
            }
            for channel in channels.order_by('-is_active', 'component_system__name', 'path')
        ]
        return JsonResponse({'data': channels})
