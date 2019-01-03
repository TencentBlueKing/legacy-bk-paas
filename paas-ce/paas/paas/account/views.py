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
from django.contrib.auth import logout
from django.http import HttpResponseForbidden
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from account.decorators import login_exempt
from account.forms import PasswordChangeForm
from account.utils import _redirect_login
from common.exceptions import BadRequestException
from common.mymako import render_mako_tostring_context
from common.responses import FailJsonResponse, OKJsonResponse
from common.utils import first_error_message
from common.views.mako import MakoTemplateView
from components.login import change_password, modify_user_info


class ProfileView(MakoTemplateView):
    """个人信息页面
    """
    template_name = "account/profile.html"

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        request = self.request

        user = request.user
        user_manage_url = "http://{}/login/accounts/user/list/".format(request.get_host())
        context.update({
            'username': user.username,
            'chname': user.chname or '--',
            'phone': user.phone or '--',
            'email': user.email or '--',
            'is_superuser': user.is_superuser,
            'user_manage_url': user_manage_url,
        })
        return context


class ModifyUserInfoView(MakoTemplateView):
    """修改用户基本信息
    """
    template_name = "account/profile_modify.html"

    def post(self, request):
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        data = {
            'chname': request.POST.get('chname').strip(),
            'phone': request.POST.get('phone').strip(),
            'email': request.POST.get('email').strip()
        }

        ok, message = modify_user_info(bk_token, data)
        if not ok:
            return FailJsonResponse(message or "个人信息修改失败")
        return OKJsonResponse("success")


class PasswordChangeView(View):
    """重置密码
    调用 login 系统 api 重置密码
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(PasswordChangeView, self).dispatch(*args, **kwargs)

    @method_decorator(csrf_exempt)
    def post(self, request):
        form = PasswordChangeForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            raise BadRequestException(message)

        new_password1 = form.cleaned_data.get("new_password1")
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        data = {'new_password': new_password1}

        ok, message = change_password(bk_token, data)
        if not ok:
            return FailJsonResponse(message or "密码重置失败")
        return OKJsonResponse("success")


class LogoutView(View):
    """登出并重定向到登录页面.
    """
    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        return super(LogoutView, self).dispatch(*args, **kwargs)

    def get(self, request):
        logout(request)
        return _redirect_login(request, False)


def csrf_failure(request, reason=""):
    return HttpResponseForbidden(render_mako_tostring_context(request, 'csrf_failure.html'), content_type='text/html')
