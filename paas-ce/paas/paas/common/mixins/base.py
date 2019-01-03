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
from django.db.models import Q
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from account.decorators import login_exempt
from app.models import App
from common.constants import PermissionErrorEnum
from common.mymako import render_mako_context
from saas.models import SaaSApp


class AccessMixin(object):
    """
    'Abstract' mixin that gives access mixins the same customizable
    functionality.
    """
    pass


class LoginExemptMixin(AccessMixin):
    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        # will call the dispatch of view
        return super(LoginExemptMixin, self).dispatch(*args, **kwargs)


class SuperuserRequiredMixin(AccessMixin):
    """
    Mixin allows you to require a user with `is_superuser` set to True.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return _redirect_not_developer(request, PermissionErrorEnum.NOT_SUPERUSER.value, '')

        return super(SuperuserRequiredMixin, self).dispatch(request, *args, **kwargs)


class AppDeveloperRequiredMixin(AccessMixin):
    """检查应用权限.

    以下两种情况出返回到错误页面：
    1   应用不存在
    2   当前用户没有管理该应用的权限，权限包括：
        普通应用: creater,developer,is_superuser
        SaaS应用: is_superuser
    """
    def dispatch(self, request, *args, **kwargs):
        username = request.user.username
        app_code = kwargs.get('app_code')

        if not app_code:
            # return view_func(request, *args, **kwargs)
            return super(AppDeveloperRequiredMixin, self).dispatch(request, *args, **kwargs)

        apps = App.objects.filter(code=app_code)
        # 应用不存在
        if not apps.exists():
            return _redirect_not_developer(request, PermissionErrorEnum.APP_NOT_EXISTS.value, app_code)

        # 判断开发者权限
        app_count = apps.filter(Q(developer__username=username) | Q(creater=username)).count()
        if app_count or request.user.is_superuser:
            # return view_func(request, *args, **kwargs)
            return super(AppDeveloperRequiredMixin, self).dispatch(request, *args, **kwargs)

        return _redirect_not_developer(request, PermissionErrorEnum.NOT_APP_DEVELOPER.value, app_code)


class SaaSAdminMixin(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        app_code = kwargs.get('app_code')
        if not app_code:
            # return view_func(request, *args, **kwargs)
            return super(SaaSAdminMixin, self).dispatch(request, *args, **kwargs)

        # app_code = 0 means a new saas
        if app_code != '0':
            apps = SaaSApp.objects.filter(code=app_code)
            # SaaS应用不存在
            if not apps.exists():
                return _redirect_not_developer(request, PermissionErrorEnum.SAAS_NOT_EXISTS.value, app_code)
        # 非超级管理员
        if not request.user.is_superuser:
            return _redirect_not_developer(request, PermissionErrorEnum.NOT_SUPERUSER.value, app_code)

        return super(SaaSAdminMixin, self).dispatch(request, *args, **kwargs)


def _redirect_not_developer(request, error_id, app_code):
    """转到没有开发者权限页面.

    error_id 值：
    1   应用不存在
    2   当前用户没有管理该应用的权限，权限包括：creater,developer,is_superuser
    """
    if not request.is_ajax():
        template = 'error/app_error{}.html'.format(error_id)
        return render_mako_context(request, template, {'app_code': app_code})

    url = '{}app/{}/error/{}/'.format(settings.SITE_URL, app_code, error_id)
    return HttpResponse(status=402, content=url)
