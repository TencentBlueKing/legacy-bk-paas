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

from functools import wraps

from django.http import JsonResponse
from django.utils.decorators import available_attrs
from django.utils.translation import ugettext as _

from common.redirect import redirect_403, redirect_app_not_exists
from common.bk_iam import Permission, ActionEnum
from app.models import App
from saas.models import SaaSApp


def app_exists(view_func):
    """
    应用必须存在
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        app_code = kwargs.get("app_code")
        if not app_code:
            return view_func(request, *args, **kwargs)

        apps = App.objects.filter(code=app_code)
        if not apps.exists():
            return redirect_app_not_exists(request, app_code)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def has_app_develop_permission(view_func):
    """
    应用开发权限
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        username = request.user.username
        app_code = kwargs.get("app_code")
        if not app_code:
            return view_func(request, *args, **kwargs)

        # 判断开发者权限
        if Permission().allowed_develop_app(username, app_code):
            return view_func(request, *args, **kwargs)

        # return no_app_develop_permission
        return redirect_403(request, username, ActionEnum.DEVELOP_APP, app_code)

    return _wrapped_view


def has_app_develop_permission_or_is_smart_admin(view_func):
    """
    应用开发权限 或 smart 管理员
    使用位置: 日志查询等位于多个位置的权限校验
    NOTE: smart管理员可能会有权限看到其他应用的日志
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        username = request.user.username
        app_code = kwargs.get("app_code")
        if not app_code:
            return view_func(request, *args, **kwargs)

        # 查表, 确认app身份
        try:
            app = App.objects.get(code=app_code)
        except Exception:
            return redirect_app_not_exists(request, app_code)

        if app.is_saas:
            # 判断是否有smart管理权限
            if not Permission().allowed_manage_smart(username):
                return redirect_403(request, username, ActionEnum.MANAGE_SMART)
            else:
                return view_func(request, *args, **kwargs)
        else:
            # 判断开发者权限
            if Permission().allowed_develop_app(username, app_code):
                return view_func(request, *args, **kwargs)
            else:
                # return no_app_develop_permission
                return redirect_403(request, username, ActionEnum.DEVELOP_APP, app_code)

    return _wrapped_view


def smart_app_exists(view_func):
    """
    smart应用必须存在
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        app_code = kwargs.get("app_code")
        if not app_code:
            return view_func(request, *args, **kwargs)

        apps = SaaSApp.objects.filter(code=app_code)
        if not apps.exists():
            return redirect_app_not_exists(request, app_code)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def has_smart_manage_permission(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        username = request.user.username
        if not Permission().allowed_manage_smart(username):
            return redirect_403(request, username, ActionEnum.MANAGE_SMART)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def has_system_ops_permission(view_func):
    """
    服务器 + 第三方服务管理权限
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        username = request.user.username
        if not Permission().allowed_ops_system(username):
            return redirect_403(request, username, ActionEnum.OPS_SYSTEM)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def has_apigateway_manage_permission(view_func):
    """
    API网关管理权限
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        username = request.user.username
        if not Permission().allowed_manage_apigateway(username):
            return redirect_403(request, username, ActionEnum.MANAGE_APIGATEWAY)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def has_apigateway_manage_permission_for_classfunc(view_func):
    """
    API网关管理权限，类方法装饰器
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(self, request, *args, **kwargs):
        username = request.user.username
        if Permission().allowed_manage_apigateway(username):
            return view_func(self, request, *args, **kwargs)

        if request.is_ajax():
            return JsonResponse(
                {
                    "error_message": _(u"您没有访问权限，请联系系统管理员添加！"),
                    "data": None,
                }
            )
        return redirect_403(request, username, ActionEnum.MANAGE_APIGATEWAY)

    return _wrapped_view


def escape_exempt(view_func):
    """
    XSS Escape豁免,被此装饰器修饰的action可以不转义数据
    """

    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapped_view.escape_exempt = True
    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)


def escape_exempt_param(*param_list, **param_list_dict):
    """
    此装饰器用来豁免某个view函数的某个参数
    @param param_list: 参数列表
    @return:
    """

    def _escape_exempt_param(view_func):
        def wrapped_view(*args, **kwargs):
            return view_func(*args, **kwargs)

        if param_list_dict.get("param_list"):
            wrapped_view.escape_exempt_param = param_list_dict["param_list"]
        else:
            wrapped_view.escape_exempt_param = list(param_list)
        return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)

    return _escape_exempt_param
