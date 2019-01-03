# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from functools import wraps

from django.utils.decorators import available_attrs
from django.shortcuts import render
from django.utils.translation import ugettext as _

from .django_utils import JsonResponse


def is_user_super(view_func):
    """
    检查用户是否为超级用户
    """
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return view_func(self, request, *args, **kwargs)
        else:
            if request.is_ajax():
                return JsonResponse({
                    'error_message': _(u'您没有访问权限，请联系系统管理员添加！'),
                    'data': None
                })
            return render(request, '403.html')
    return _wrapped_view
