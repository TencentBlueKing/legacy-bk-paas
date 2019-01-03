# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import json

from django.utils.translation import ugettext as _
from django.views.generic import View

from common.mixins.exempt import LoginExemptMixin, CsrfExemptMixin, CsrfAndLoginExemptMixin
from common.utils.basic import first_error_message
from common.responses import ApiV1FailJsonResponse, ApiV1OKJsonResponse

from bkaccount.forms import PasswordForm, BaseUserInfoForm, WeixinInfoForm
from bkaccount.models import BkUser
from bkaccount.utils import validate_bk_token, is_request_from_esb
from bkaccount.constants import ApiErrorCodeEnum


class CheckLoginView(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, user, message = validate_bk_token(request.GET)
        if not is_valid:
            return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)
        return ApiV1OKJsonResponse(_("用户验证成功"), data={'username': user.username})


class UserView(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, user, message = validate_bk_token(request.GET)
        if not is_valid:
            # 如果是ESB的请求，可以直接从参数中获取用户名
            is_from_esb = is_request_from_esb(request)
            username = request.GET.get('username')
            if not is_from_esb or not username:
                return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)
        else:
            username = user.username

        # 获取用户数据
        result, data, message = BkUser.objects.get_user_info(username)
        if not result:
            return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.USER_NOT_EXISTS2)

        return ApiV1OKJsonResponse(_("用户信息获取成功"), data=data)


class AllUsersView(LoginExemptMixin, View):
    def get(self, request):
        # 非ESB的请求需要验证登录态 bk_token
        if not is_request_from_esb(request):
            # 验证Token参数
            is_valid, user, message = validate_bk_token(request.GET)
            if not is_valid:
                return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        # 获取用户角色参数,空为所有用户
        role = request.GET.get('role', '')

        # 获取用户信息
        data = BkUser.objects.get_all_user(role)
        return ApiV1OKJsonResponse(_("用户信息获取成功"), data=data)


class BatchUsersView(CsrfAndLoginExemptMixin, View):
    def post(self, request):
        try:
            post_data = json.loads(request.body)
        except Exception:
            return ApiV1FailJsonResponse(_("请求参数格式错误,必须为json格式"), code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        # 非ESB的请求需要验证登录态 bk_token
        if not is_request_from_esb(request):
            # 验证Token参数
            is_valid, user, message = validate_bk_token(post_data)
            if not is_valid:
                return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        username_list = post_data.get('username_list')
        if not username_list:
            return ApiV1FailJsonResponse(_("缺少参数:username_list"), code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        # 获取用户信息
        data = BkUser.objects.get_batch_user_with_dict(username_list)
        return ApiV1OKJsonResponse(_("用户信息获取成功"), data=data)


class CurrentUserPasswordView(CsrfExemptMixin, View):
    def put(self, request):
        try:
            request_param = json.loads(request.body)
        except Exception:
            return ApiV1FailJsonResponse(_("请求参数格式错误,必须为json格式"), code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        form = PasswordForm(request_param)

        if not form.is_valid():
            message = first_error_message(form)
            return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        result, error_code, message = BkUser.objects.modify_password_by_username(request.user.username,
                                                                                 form.cleaned_data["new_password"])
        if not result:
            return ApiV1FailJsonResponse(message, code=error_code)

        return ApiV1OKJsonResponse(_("密码重置成功"))


class CurrentUserBaseInfoView(CsrfExemptMixin, View):
    def post(self, request):
        try:
            request_param = json.loads(request.body)
        except Exception:
            return ApiV1FailJsonResponse(_("请求参数格式错误,必须为json格式"), code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        form = BaseUserInfoForm(request_param)

        if not form.is_valid():
            message = first_error_message(form)
            return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        result, error_code, message = BkUser.objects.modify_user_info(request.user.username,
                                                                      form.cleaned_data["chname"],
                                                                      form.cleaned_data["phone"],
                                                                      form.cleaned_data["email"])
        if not result:
            return ApiV1FailJsonResponse(message, code=error_code)

        return ApiV1OKJsonResponse(_("用户信息修改成功"))


class CurrentUserWeixinInfoView(CsrfExemptMixin, View):
    def post(self, request):
        try:
            request_param = json.loads(request.body)
        except Exception:
            return ApiV1FailJsonResponse(_("请求参数格式错误,必须为json格式"), code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        form = WeixinInfoForm(request_param)

        if not form.is_valid():
            message = first_error_message(form)
            return ApiV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        result, message = BkUser.objects.bind_wx_user_info(request.user, form.cleaned_data["wx_userid"])

        if not result:
            return ApiV1FailJsonResponse(message)

        return ApiV1OKJsonResponse(_("绑定成功"))

    def delete(self, request):
        result, message = BkUser.objects.unbind_wx_user_info(request.user)

        if not result:
            return ApiV1FailJsonResponse(message)

        return ApiV1OKJsonResponse(_("解绑成功"))
