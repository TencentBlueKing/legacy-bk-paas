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

import random

from django.contrib.auth import authenticate
from django.conf import settings
from django.template.response import TemplateResponse
from django.contrib.sites.shortcuts import get_current_site
from django.utils.translation import ugettext as _


from bkauth.constants import REDIRECT_FIELD_NAME
from bkauth import actions
from bkauth.forms import BkAuthenticationForm
from bkauth.utils import set_bk_token_invalid
from common.log import logger
from common.exceptions import AuthenticationError
from common.usermgr import get_categories_str

from . import settings as wx_settings

def login(request):
    """
    登录处理
    """

    # 获取用户实际请求的URL, 目前account.REDIRECT_FIELD_NAME = 'c_url'
    redirect_to = request.GET.get(REDIRECT_FIELD_NAME, '')
    # 获取用户实际访问的蓝鲸应用
    app_id = request.POST.get("app_id", request.GET.get("app_id", ""))

    # 来自注销
    is_from_logout = bool(request.GET.get('is_from_logout') or 0)

    template_name = "account/login_ce_wecom.html"

    reset_password_url = "%s://%s/o/bk_user_manage/reset_password" % (settings.HTTP_SCHEMA, request.get_host())

    # 企业微信登录回调后会自动添加code参数
    code = request.GET.get('code', None)

    # GET 请求中query param携带code，认为是企业微信登录回调后的请求
    if code and request.method == "GET":
        return _wecom_login(request=request,
            code=code,
            template_name=template_name,
            reset_password_url=reset_password_url,
            redirect_to=redirect_to,
            app_id=app_id)
    else:
        # 蓝鲸账号密码登录由_bk_login处理
        return _bk_login(request=request, 
            authentication_form=BkAuthenticationForm, 
            template_name=template_name, 
            reset_password_url=reset_password_url, 
            redirect_to=redirect_to,
            app_id=app_id)


def _bk_login(request, authentication_form, template_name, reset_password_url, redirect_to, app_id):
    """
    处理登录页面和登录动作：
    1. 获取扫码登录页面的GET请求
    2. 账号密码登录页面的GET请求
    3. 账号密码登录页面的POST请求
    """

    error_message = ""
    login_redirect_to = ""

    # 记录当前用户的登录方式，True为蓝鲸账号密码登录，False为企业微信二维码登录
    bk_active = False

    # POST
    if request.method == "POST":
        form = authentication_form(request, data=request.POST)
        try:
            if form.is_valid():
                return actions.login_success_response(request, form, redirect_to, app_id)
        except AuthenticationError as e:
            login_redirect_to = e.redirect_to
            error_message = e.message
            bk_active = True
        else:
            error_message = _(u"账户或者密码错误，请重新输入")
    # GET
    else:
        form = authentication_form(request)

    # NOTE: get categories from usermgr
    categories = get_categories_str()

    current_site = get_current_site(request)
    state = "".join(random.sample('zyxwvutsrqponmlkjihgfedcba9876543210',20))
    context = {
        "form": form,
        "error_message": error_message,
        REDIRECT_FIELD_NAME: redirect_to,
        "site": current_site,
        "site_name": current_site.name,
        "app_id": app_id,
        "reset_password_url": reset_password_url,
        "login_redirect_to": login_redirect_to,
        "categories": categories,
        "is_plain": request.path_info == "/plain/",
        "wx_appid": wx_settings.CORP_ID,
        "agent_id": wx_settings.AGENT_ID,
        "state": state,
        "bk_active": bk_active
    }
    request.session["state"] = state
    response = TemplateResponse(request, template_name, context)
    response = set_bk_token_invalid(request, response)
    return response


def _wecom_login(request, code, template_name, reset_password_url, redirect_to, app_id):
    """
    企业微信扫码登录页面和动作
    """

    # NOTE: get categories from usermgr
    categories = get_categories_str()

    current_site = get_current_site(request)
    qr_error_message = ""
    context = {
        "qr_error_message": qr_error_message,
        REDIRECT_FIELD_NAME: redirect_to,
        "site": current_site,
        "site_name": current_site.name,
        "app_id": app_id,
        "reset_password_url": reset_password_url,
        "categories": categories,
        "is_plain": request.path_info == "/plain/",
        "wx_appid": wx_settings.CORP_ID,
        "agent_id": wx_settings.AGENT_ID,
        "state": "",
    }

    state = request.GET.get("state", "")
    state_from_session = request.session.get("state", "")
    # 校验state，防止csrf攻击
    if state != state_from_session:
        qr_error_message = u"state校验失败，请联系管理员"
        logger.debug(
            "custom_login:qrcode.wecom state != state_from_session [state=%s, state_from_session=%s]",
            state,
            state_from_session,
        )

        context_update = {"qr_error_message": qr_error_message}
        return _wecom_login_failed_response(request=request,
            template_name=template_name,
            context=context,
            context_update=context_update)

    # 验证用户登录是否OK
    user = authenticate(code=code)
    if user is None:
        # 企业微信登录失败提示信息
        qr_error_message = u"用户不存在"
        logger.debug("custom_login: qrcode.wecom user is None")
        context_update = {"qr_error_message": qr_error_message}
        return _wecom_login_failed_response(request=request,
            template_name=template_name,
            context=context,
            context_update=context_update)
    # 成功，则调用蓝鲸登录成功的处理函数，并返回响应
    logger.debug("custom_login:qrcode.wecom login success, will redirect_to=%s", redirect_to)
    return actions.login_success_response(request, user, redirect_to, app_id)

def _wecom_login_failed_response(request, template_name, context, context_update):
    """
    企业微信登录失败响应
    """
    new_state = "".join(random.sample('zyxwvutsrqponmlkjihgfedcba9876543210',20))
    request.session["state"] = new_state
    context.update({"state": new_state})
    context.update(context_update)
    response = TemplateResponse(request, template_name, context)
    response = set_bk_token_invalid(request, response)
    return response