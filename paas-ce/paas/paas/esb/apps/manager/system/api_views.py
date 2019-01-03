# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.views.generic import View
from django.utils.translation import ugettext as _

from esb.common.django_utils import JsonResponse
from esb.bkcore.models import ComponentSystem, ESBChannel, ESBBuffetComponent
from .forms import ComponentSystemForm
from esb.common.decorators import is_user_super


class DeletedSystemView(View):
    """Deleted system view"""

    @is_user_super
    def post(self, request):
        system_ids = request.POST.get('system_ids')
        system_ids = system_ids.split(',') if system_ids else []
        objs = ComponentSystem.objects.filter(id__in=system_ids)
        ESBChannel.objects.filter(component_system__in=objs).delete()
        ESBBuffetComponent.objects.filter(system__in=objs).delete()
        affected_rows = objs.count()
        objs.delete()
        return JsonResponse({'affected_rows': affected_rows, 'error_message': None})


class AddSystemView(View):
    """添加系统"""
    @is_user_super
    def post(self, request):
        form = ComponentSystemForm(request.POST)
        if form.is_valid():
            form.save()
            data = form.cleaned_data
            data['id'] = form.instance.id
            data['display_name'] = form.instance.get_display_name()
            return JsonResponse({'result': True, 'data': data})

        error_message = ';'.join([','.join([_(err) for err in field_error]) for field_error in form.errors.values()])
        return JsonResponse({'result': False, 'error_message': error_message})
