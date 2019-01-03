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
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.generic import View
from django.utils.translation import ugettext as _

from esb.bkcore.models import ComponentSystem
from esb.bkcore.constants import DEFAULT_DOC_CATEGORY
from esb.common.decorators import is_user_super
from esb.common.django_utils import i18n_form, get_cur_language
from esb.configs.default import menu_items
from .forms import ComponentSystemForm, EditComponentSystemForm, SystemDocCategory
from ..utils import md2html

menu_active_item = 'system_manager'


class SystemListView(View):
    """System list page"""

    @is_user_super
    def get(self, request):
        systems = ComponentSystem.objects.all().order_by('name')
        cur_language = get_cur_language()
        return render(request, 'manager/system/list.html', {
            'systems': systems,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
            'system_term_html': md2html('%s/system' % cur_language)
        })


class AddSystemView(View):
    """Add ComponentSystem view"""

    @is_user_super
    def get(self, request):
        form = ComponentSystemForm()
        doc_category_list = SystemDocCategory.objects.all()
        form = i18n_form(form)
        return render(request, 'manager/system/add.html', {
            'form': form,
            'default_doc_category': DEFAULT_DOC_CATEGORY,
            'doc_category_list': doc_category_list,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })

    @is_user_super
    def post(self, request):
        form = ComponentSystemForm(request.POST)
        if form.is_valid():
            form.save()
            form.add_and_clean_doc_category()
            return HttpResponseRedirect(reverse('manager.system.list'))
        form = i18n_form(form)
        doc_category_list = SystemDocCategory.objects.all()
        return render(request, 'manager/system/add.html', {
            'form': form,
            'default_doc_category': DEFAULT_DOC_CATEGORY,
            'doc_category_list': doc_category_list,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })


class EditSystemView(View):
    """Edit system view"""

    @is_user_super
    def get(self, request, system_id):
        system = ComponentSystem.objects.get(id=system_id)

        if system.is_official:
            system.label = _(system.label)
            system.remark = _(system.remark)

        form = EditComponentSystemForm(instance=system)

        if system.is_official:
            form.fields['name'].widget.attrs['readonly'] = True
            form.fields['label'].widget.attrs['readonly'] = True
            form.fields['remark'].widget.attrs['readonly'] = True

        doc_category_list = SystemDocCategory.objects.all()
        form = i18n_form(form)
        return render(request, 'manager/system/edit.html', {
            'form': form,
            'system': system,
            'doc_category_list': doc_category_list,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })

    @is_user_super
    def post(self, request, system_id):
        system = ComponentSystem.objects.get(id=system_id)
        post_data = request.POST.copy()

        if system.is_official:
            post_data['label'] = system.label
            post_data['remark'] = system.remark

        form = EditComponentSystemForm(post_data, instance=system)
        if form.is_valid():
            form.save()

            if not system.is_official:
                form.add_and_clean_doc_category()

            return HttpResponseRedirect(reverse('manager.system.list'))
        form = i18n_form(form)
        doc_category_list = SystemDocCategory.objects.all()
        return render(request, 'manager/system/edit.html', {
            'form': form,
            'doc_category_list': doc_category_list,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })
