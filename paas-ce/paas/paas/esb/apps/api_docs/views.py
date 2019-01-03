# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.views.generic import View
from django.shortcuts import render
from django.http import Http404
from django.utils.translation import ugettext as _

from esb.bkcore.models import ESBChannel, ComponentSystem
from esb.configs.default import menu_items
from .utils import get_system_category

menu_active_item = 'api_docs'


class TranslateTest(View):

    def get(self, request):
        from django.http import HttpResponse
        return HttpResponse(_(u'系统名称'))


class BaseDocsCategory(View):

    def get_base_category(self):
        """获取文档分类"""
        return get_system_category()

    def get_system_info(self, system_name):
        try:
            system = ComponentSystem.objects.get(name=system_name)
        except Exception:
            raise Http404
        return {
            'system_id': system.id,
            'system_name': system.name,
            'system_label': system.label_display,
            'system_remark': system.remark_display,
        }

    def get_apis_by_system(self, system_id):
        # 现阶段先根据接口name排序,后面根据需求再做调整
        api_info = ESBChannel.objects.filter(component_system_id=system_id, is_hidden=False).order_by('component_name')
        return [
            {
                'id': api.id,
                'path': api.path,
                'system_id': api.component_system_id,
                'name': api.component_name,
                'label': api.name_display,
                'created_time': api.created_time,
                'last_modified_time': api.last_modified_time,
                'is_new_api': api.is_new_api,
            }
            for api in api_info
        ]

    def get_api_info(self, system_id, api_name):
        try:
            api_info = ESBChannel.objects.get(
                component_system_id=system_id,
                component_name=api_name,
                is_hidden=False
            )
        except Exception:
            raise Http404
        return {
            'id': api_info.id,
            'path': api_info.path,
            'system_id': api_info.component_system_id,
            'name': api_info.component_name,
            'label': api_info.name_display,
        }

    def get_other_system_info(self, system_name):
        docs_category = self.get_base_category()
        system = self.get_system_info(system_name)
        return {
            'other_system_info': docs_category,
            'curr_system_info': {
                'name': system_name,
                'label': system['system_label'],
            }
        }


class Index(BaseDocsCategory):
    """首页"""
    def get(self, request):
        docs_category = self.get_base_category()

        return render(request, 'api_docs/index.html', {
            'docs_category': docs_category,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })


class ApiInfoBySystem(BaseDocsCategory):
    """获取系统简介以及详细接口"""

    def get(self, request, system_name):
        # 除去当前系统的其它系统信息
        all_system_info = self.get_other_system_info(system_name)
        # 获取当前系统的所有api
        system_info = self.get_system_info(system_name)
        curr_api_info = self.get_apis_by_system(system_info['system_id'])
        data = {
            'curr_api_info': curr_api_info,
            'api_info_by_system': list(curr_api_info),
            'system_summary': system_info.get('system_remark') or _(u'暂无系统简介'),
            'flag': False,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        }
        data.update(all_system_info)
        return render(request, 'api_docs/system_api_index.html', data)


class ApiDocByApiName(BaseDocsCategory):

    def get(self, request, system_name, api_name):
        # 获取对应的接口信息
        system_info = self.get_system_info(system_name)
        # 查询对应的接口
        api_info = self.get_api_info(system_info['system_id'], api_name)
        all_system_info = self.get_other_system_info(system_name)
        # 获取当前系统的所有api
        curr_api_info = self.get_apis_by_system(system_info['system_id'])
        data = {
            'curr_api_info': curr_api_info,
            'api_info': api_info,
            'flag': True,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        }
        data.update(all_system_info)
        return render(request, 'api_docs/system_api_doc.html', data)
