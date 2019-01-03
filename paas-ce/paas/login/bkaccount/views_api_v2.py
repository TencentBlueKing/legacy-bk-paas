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

from common.mixins.exempt import LoginExemptMixin, CsrfAndLoginExemptMixin
from common.responses import ApiV2FailJsonResponse, ApiV2OKJsonResponse
from bkaccount.constants import ApiErrorCodeEnumV2
from bkaccount.models import BkUser
from bkaccount.utils import validate_bk_token, is_request_from_esb


class CheckLoginView(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, user, message = validate_bk_token(request.GET)
        if not is_valid:
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)
        return ApiV2OKJsonResponse(_("用户验证成功"), data={'bk_username': user.username})


class UserView(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, user, message = validate_bk_token(request.GET)
        if not is_valid:
            # 如果是ESB的请求，可以直接从参数中获取用户名
            is_from_esb = is_request_from_esb(request)
            username = request.GET.get('bk_username')
            if not is_from_esb or not username:
                return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)
        else:
            username = user.username

        # 获取用户数据
        result, data, message = BkUser.objects.get_user_info_v2(username)
        if not result:
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.USER_NOT_EXISTS2)

        return ApiV2OKJsonResponse(_("用户信息获取成功"), data=data)


class AllUsersView(LoginExemptMixin, View):
    def get(self, request):
        # 非ESB的请求需要验证登录态 bk_token
        if not is_request_from_esb(request):
            # 验证Token参数
            is_valid, user, message = validate_bk_token(request.GET)
            if not is_valid:
                return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)

        # 获取用户角色参数,空为所有用户
        role = request.GET.get('bk_role', '')

        # 获取用户信息
        data = BkUser.objects.get_all_users_v2(role)
        return ApiV2OKJsonResponse(_("用户信息获取成功"), data=data)


class BatchUsersView(CsrfAndLoginExemptMixin, View):
    def post(self, request):
        try:
            post_data = json.loads(request.body)
        except Exception:
            return ApiV2FailJsonResponse(_("请求参数格式错误,必须为json格式"), code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)

        # 非ESB的请求需要验证登录态 bk_token
        if not is_request_from_esb(request):
            # 验证Token参数
            is_valid, user, message = validate_bk_token(post_data)
            if not is_valid:
                return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)

        username_list = post_data.get('bk_username_list')
        if not username_list:
            return ApiV2FailJsonResponse(_("缺少参数:bk_username_list"), code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)

        # 获取用户信息
        data = BkUser.objects.get_batch_users_with_dict_v2(username_list)
        return ApiV2OKJsonResponse(_("用户信息获取成功"), data=data)
