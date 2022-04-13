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

from django.http import HttpResponseRedirect, HttpResponseForbidden
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import logout as auth_logout
from django.contrib.sites.shortcuts import get_current_site
from django.utils.translation import ugettext as _
from django.template.response import TemplateResponse
from django.utils.module_loading import import_string
from django.views.generic import View
from django.utils.decorators import available_attrs

from common.license import check_license
from common.exceptions import AuthenticationError, PasswordNeedReset
from common.mixins.exempt import LoginExemptMixin
from common.usermgr import get_categories_str
from bkauth.utils import set_bk_token_invalid, is_safe_url
from bkauth.actions import login_success_response, login_license_fail_response
from bkauth.forms import BkAuthenticationForm
from bkauth.constants import REDIRECT_FIELD_NAME


def only_plain_xframe_options_exempt(view_func):
    """
    only allow /plain/ to be opened by a iframe
    add some code: from django.views.decorators.clickjacking import xframe_options_exempt
    """

    def wrapped_view(*args, **kwargs):
        resp = view_func(*args, **kwargs)

        if not isinstance(resp, HttpResponseRedirect):
            origin_url = resp._request.META.get("HTTP_REFERER")
            login_host = resp._request.get_host()

            if resp._request.path_info == "/plain/" and is_safe_url(url=origin_url, host=login_host):
                resp.xframe_options_exempt = True

        return resp

    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)


class LoginView(LoginExemptMixin, View):
    """
    登录 & 登录弹窗
    """

    is_plain = False

    @only_plain_xframe_options_exempt
    def get(self, request):
        # TODO1: from django.views.decorators.clickjacking import xframe_options_exempt
        # TODO2: should check if the request from the legal domain
        return self._login(request)

    @only_plain_xframe_options_exempt
    def post(self, request):
        return self._login(request)

    def _login(self, request):
        # 判断调用方式
        if settings.LOGIN_TYPE != "custom_login":
            return _bk_login(request)

        if settings.EDITION == "ee":
            # 校验企业正式是否有效，无效则不可登录
            is_license_ok, message, vaild_start_time, vaild_end_time = check_license()
            if not is_license_ok:
                return login_license_fail_response(request)

        # 调用自定义login view
        custom_login_view = import_string(settings.CUSTOM_LOGIN_VIEW)
        return custom_login_view(request)


def _bk_login(request):
    """
    登录页面和登录动作
    """
    authentication_form = BkAuthenticationForm
    # NOTE: account/login.html 为支持自适应大小的模板
    template_name = "account/login.html"
    forget_reset_password_url = "%s://%s/o/bk_user_manage/reset_password" % (settings.HTTP_SCHEMA, request.get_host())
    token_set_password_url = ""

    redirect_to = request.POST.get(REDIRECT_FIELD_NAME, request.GET.get(REDIRECT_FIELD_NAME, ""))
    # support oauth2 redirect ?next=
    if not redirect_to and "next" in request.GET:
        redirect_to = request.GET.get("next")

    app_id = request.POST.get("app_id", request.GET.get("app_id", ""))

    if settings.EDITION == "ee":
        # 校验企业证书是否有效，无效则不可登录
        is_license_ok, message, vaild_start_time, vaild_end_time = check_license()
    else:
        is_license_ok = True
        template_name = "account/login_ce.html"

    error_message = ""
    login_redirect_to = ""

    # POST
    if request.method == "POST" and is_license_ok:
        form = authentication_form(request, data=request.POST)
        try:
            if form.is_valid():
                return login_success_response(request, form, redirect_to, app_id)
        except AuthenticationError as e:
            login_redirect_to = e.redirect_to
            error_message = e.message
        except PasswordNeedReset as e:
            token_set_password_url = e.reset_password_url
            error_message = e.message
        else:
            error_message = _(u"账户或者密码错误，请重新输入")
    # GET
    else:
        form = authentication_form(request)

    # NOTE: get categories from usermgr
    categories = get_categories_str()

    current_site = get_current_site(request)
    context = {
        "form": form,
        "error_message": error_message,
        REDIRECT_FIELD_NAME: redirect_to,
        "site": current_site,
        "site_name": current_site.name,
        "app_id": app_id,
        "is_license_ok": is_license_ok,
        "forget_password_url": forget_reset_password_url,
        "token_set_password_url": token_set_password_url,
        "login_redirect_to": login_redirect_to,
        "categories": categories,
        "is_plain": request.path_info == "/plain/",
    }

    response = TemplateResponse(request, template_name, context)
    response = set_bk_token_invalid(request, response)
    return response


class LogoutView(LoginExemptMixin, View):
    """
    登出并重定向到登录页面
    """

    def get(self, request):
        auth_logout(request)
        next_page = None

        if REDIRECT_FIELD_NAME in request.POST or REDIRECT_FIELD_NAME in request.GET:
            next_page = request.POST.get(REDIRECT_FIELD_NAME, request.GET.get(REDIRECT_FIELD_NAME))
            # Security check -- don't allow redirection to a different host.
            if not is_safe_url(url=next_page, host=request.get_host()):
                next_page = request.path

        if next_page:
            # Redirect to this page until the session has been cleared.
            response = HttpResponseRedirect(next_page)
        else:
            # Redirect to login url.
            response = HttpResponseRedirect("%s?%s" % (settings.LOGIN_URL, "is_from_logout=1"))

        # 将登录票据设置为不合法
        response = set_bk_token_invalid(request, response)
        return response


def csrf_failure(request, reason=""):
    return HttpResponseForbidden(render(request, "csrf_failure.html"), content_type="text/html")
