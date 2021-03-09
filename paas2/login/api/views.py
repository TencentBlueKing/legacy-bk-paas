# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.utils.translation import ugettext as _
from django.views.generic import View

from common.mixins.exempt import LoginExemptMixin
from bkauth.utils import validate_bk_token
from api.constants import ApiErrorCodeEnum, ApiErrorCodeEnumV2, ApiErrorCodeEnumV3
from api.utils import (
    APIV1FailJsonResponse,
    APIV1OKJsonResponse,
    APIV2FailJsonResponse,
    APIV2OKJsonResponse,
    APIV3FailJsonResponse,
    APIV3OKJsonResponse,
    is_request_from_esb,
)

from common import usermgr


########
#  v1  #
########


class CheckLoginView(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            return APIV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)
        return APIV1OKJsonResponse(_("用户验证成功"), data={"username": username})


class UserView(LoginExemptMixin, View):
    def get(self, request):
        """
        获取用户信息API
        """
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            # 如果是ESB的请求，可以直接从参数中获取用户id
            is_from_esb = is_request_from_esb(request)
            username = request.GET.get("username")
            if not is_from_esb or not username:
                return APIV1FailJsonResponse(message, code=ApiErrorCodeEnum.PARAM_NOT_VALID)

        # 获取用户数据
        ok, message, data = usermgr.get_user(username)
        if not ok:
            return APIV1FailJsonResponse(message, code=ApiErrorCodeEnum.USER_NOT_EXISTS2)

        return APIV1OKJsonResponse(_("用户信息获取成功"), data=data)


########
#  v2  #
########


class CheckLoginViewV2(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            return APIV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)
        return APIV2OKJsonResponse(_("用户验证成功"), data={"bk_username": username})


class UserViewV2(LoginExemptMixin, View):
    def get(self, request):
        """
        获取用户信息API
        """
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            # 如果是ESB的请求，可以直接从参数中获取用户id
            is_from_esb = is_request_from_esb(request)
            username = request.GET.get("bk_username")
            if not is_from_esb or not username:
                return APIV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID)

        # 获取用户数据
        ok, message, data = usermgr.get_user(username, "v2")
        if not ok:
            return APIV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.USER_NOT_EXISTS2)

        return APIV2OKJsonResponse(_("用户信息获取成功"), data=data)


########
#  v3  #
########


class CheckLoginViewV3(LoginExemptMixin, View):
    def get(self, request):
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            return APIV3FailJsonResponse(message, code=ApiErrorCodeEnumV3.PARAM_NOT_VALID)
        return APIV3OKJsonResponse(_("用户验证成功"), data={"bk_username": username})


class UserViewV3(LoginExemptMixin, View):
    def get(self, request):
        """
        获取用户信息API
        v3, 直接返回usermgr返回的内容不做字段转换
        """
        # 验证Token参数
        is_valid, username, message = validate_bk_token(request.GET)
        if not is_valid:
            # 如果是ESB的请求，可以直接从参数中获取用户id
            is_from_esb = is_request_from_esb(request)
            username = request.GET.get("bk_username")
            if not is_from_esb or not username:
                return APIV3FailJsonResponse(message, code=ApiErrorCodeEnumV3.PARAM_NOT_VALID)

        # 获取用户数据
        ok, message, data = usermgr.get_user(username, "v3")
        if not ok:
            return APIV3FailJsonResponse(message, code=ApiErrorCodeEnumV3.USER_NOT_EXISTS2)

        return APIV3OKJsonResponse(_("用户信息获取成功"), data=data)
