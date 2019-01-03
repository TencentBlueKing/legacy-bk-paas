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
from django.http import Http404
from django.db.models import Q
from django.utils.translation import ugettext as _

from esb.bkcore.models import ComponentAPIDoc, ESBChannel, ComponentSystem, FeedbackForComponentDocs
from esb.common.django_utils import JsonResponse
from .utils import get_system_category


class BaseApiCls(View):
    pass


class AllApi(BaseApiCls):

    def get(self, request):
        # 获取接口以及对应的说明
        filter_val = request.GET.get('keyword')

        if filter_val:
            all_comp_info = ESBChannel.objects.filter(is_hidden=False)\
                .filter(Q(component_name__icontains=filter_val) | Q(name__icontains=filter_val))\
                .order_by('component_system_id')
        else:
            all_comp_info = ESBChannel.objects.filter(is_hidden=False)\
                .order_by('component_system_id')
        all_comp_info = [
            {
                'id': api.id,
                'name': api.component_name,
                'label': api.name_display,
                'system_id': api.component_system_id,
            }
            for api in all_comp_info
        ]
        # 通过system_id获取系统信息
        system_ids = [api['system_id'] for api in all_comp_info]
        all_system_info = ComponentSystem.objects.filter(id__in=system_ids).values('id', 'name', 'label')
        all_system_info = dict([(system['id'], system) for system in list(all_system_info)])
        # 组装参数
        for comp_info in all_comp_info:
            system_info = all_system_info.get(comp_info['system_id'], {})
            comp_info.update({
                'system_name': system_info.get('name', ''),
                'system_label': system_info.get('label', ''),
            })
        all_comp_info = all_comp_info[:30]
        return JsonResponse(list(all_comp_info))


class GetApisBySystem(BaseApiCls):

    def get(self, request, system_name):
        """查询指定系统下的apis信息"""
        # 获取当前系统的信息
        try:
            system_info = ComponentSystem.objects.get(name=system_name)
        except Exception:
            raise Http404
        api_info_by_system = ESBChannel.objects.filter(component_system_id=system_info.id, is_hidden=False)\
            .order_by('component_name')
        api_info_by_system = [
            {
                'id': api.id,
                'system_id': api.component_system_id,
                'name': api.component_name,
                'label': api.name_display,
                'path': api.path,
                'type': api.type,
            }
            for api in api_info_by_system
        ]
        return JsonResponse({
            'system_summary': system_info.remark_display or _(u'暂无系统简介'),
            'api_info_by_system': list(api_info_by_system),
        })


class GetApiDocByApiId(BaseApiCls):

    def get(self, request, system_name, api_id):
        try:
            component = ESBChannel.objects.get(id=api_id)
            api = ComponentAPIDoc.objects.get(component_id=component.id)
            doc_html = api.doc_html_display
        except Exception:
            doc_html = ''
        return JsonResponse({
            'doc_html': doc_html
        })


class SubmitTheAdvice(BaseApiCls):

    def post(self, request):
        data = dict(request.POST.items())
        FeedbackForComponentDocs(
            operator=request.user.username,
            board='',
            component_id=data['api_id'],
            content=data.get('content', _("满足需求")),
        ).save()
        return JsonResponse({'result': True})


class CheckComponentExist(BaseApiCls):

    def get(self, request):
        data = dict(request.GET.items())
        try:
            system_obj = ComponentSystem.objects.get(name=data['system'])
        except Exception:
            return JsonResponse({'result': False})
        result = ESBChannel.objects.filter(component_system=system_obj, component_name=data['component']).exists()
        return JsonResponse({'result': result})

    def post(self, request):
        return JsonResponse({'result': True})


class GetSystemDocCategory(BaseApiCls):

    def get(self, request):
        return JsonResponse(get_system_category())
