# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate
from django.contrib.sites.shortcuts import get_current_site
from django.template.response import TemplateResponse

from bkauth.actions import login_failed_response, login_success_response
from bkauth.constants import REDIRECT_FIELD_NAME
from bkauth.forms import BkAuthenticationForm
from bkauth.utils import set_bk_token_invalid
from common.log import logger


def login(request):
    """
    登录处理
    """
    redirect_to = request.GET.get(REDIRECT_FIELD_NAME, "")

    # 复用bkauth的登录页面
    if request.method == "POST":
        form = BkAuthenticationForm(request, data=request.POST)

        username = form.data["username"]
        password = form.data["password"]

        # will call MockBackend.authenticate
        user = authenticate(username=username, password=password)
        if user is None:
            logger.debug("custom_login:mock user is None, will redirect_to=%s", redirect_to)
            # 直接调用蓝鲸登录失败处理方法
            return login_failed_response(request, redirect_to, app_id=None)
        # 成功，则调用蓝鲸登录成功的处理函数，并返回响应
        logger.debug("custom_login:mock login success, will redirect_to=%s", redirect_to)
        return login_success_response(request, user, redirect_to, app_id=None)
    # GET
    else:
        form = BkAuthenticationForm(request)
        current_site = get_current_site(request)
        context = {
            "form": form,
            REDIRECT_FIELD_NAME: redirect_to,
            "site": current_site,
            "site_name": current_site.name,
            # set to default
            "error_message": "",
            "app_id": "",
            "is_license_ok": True,
            "reset_password_url": "",
            "login_redirect_to": "",
        }

        template_name = "account/login.html"
        response = TemplateResponse(request, template_name, context)
        response = set_bk_token_invalid(request, response)
        return response
