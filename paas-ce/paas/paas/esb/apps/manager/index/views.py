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
from django.views.generic import View

from esb.common.decorators import is_user_super
from esb.configs.default import menu_items
from esb.common.django_utils import get_cur_language
from ..utils import md2html


menu_active_item = 'manager_index'


class IndexView(View):
    """Index page"""

    @is_user_super
    def get(self, request):
        cur_language = get_cur_language()
        return render(request, 'manager/index.html', {
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
            'index_html': md2html('%s/index' % cur_language)
        })
