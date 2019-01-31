# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from common.utils import first_error_message
from common.log import logger
from account.decorators import login_exempt
from api.decorators import esb_required_v2
from api.response import ApiV2FailJsonResponse, ApiV2OKJsonResponse
from api.constants import ApiErrorCodeEnumV2
from app.models import App
from home.models import UsefulLinks
from home.constants import LinkTypeEnum
from app_maker.forms import (LightAppCreationForm, LightAppEditionForm,
                             LightAppChangeBaseInfoForm, LightAppLogoModifiedForm)
from app_maker.utils import (get_post_data, generate_file_by_base64)


class CreateLightAppView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    @method_decorator(esb_required_v2)
    def dispatch(self, *args, **kwargs):
        return super(CreateLightAppView, self).dispatch(*args, **kwargs)

    def post(self, request):
        form = LightAppCreationForm(get_post_data(request))
        if not form.is_valid():
            message = first_error_message(form)
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID.value)

        parent_app = App.objects.get(code=form.cleaned_data["bk_app_code"])

        # 保存应用信息到数据库
        link = UsefulLinks.objects.create(
            name=form.cleaned_data["bk_light_app_name"],
            link=form.cleaned_data["app_url"],
            link_type=LinkTypeEnum.SAAS.value,
            introduction=form.cleaned_data["introduction"] or parent_app.introduction
        )
        data = {'bk_light_app_code': link.code}

        return ApiV2OKJsonResponse("创建轻应用成功", data=data)


class EditLightAppView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    @method_decorator(esb_required_v2)
    def dispatch(self, *args, **kwargs):
        return super(EditLightAppView, self).dispatch(*args, **kwargs)

    def post(self, request):
        form = LightAppEditionForm(get_post_data(request))
        if not form.is_valid():
            message = first_error_message(form)
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID.value)

        is_ok, link = UsefulLinks.objects.is_useful_link(form.cleaned_data["bk_light_app_code"])

        # 保存应用基本信息
        introduction = form.cleaned_data["introduction"]
        link.introduction = introduction if introduction else link.introduction
        link.name = form.cleaned_data["bk_light_app_name"] if form.cleaned_data["bk_light_app_name"] else link.name
        link.link = form.cleaned_data["app_url"] if form.cleaned_data["app_url"] else link.link
        link.save()

        return ApiV2OKJsonResponse("app 修改成功", data={})


class DeleteLightAppView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    @method_decorator(esb_required_v2)
    def dispatch(self, *args, **kwargs):
        return super(DeleteLightAppView, self).dispatch(*args, **kwargs)

    def post(self, request):
        form = LightAppChangeBaseInfoForm(get_post_data(request))
        if not form.is_valid():
            message = first_error_message(form)
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID.value)

        is_ok, link = UsefulLinks.objects.is_useful_link(form.cleaned_data["bk_light_app_code"])

        # 将app状态标记为下架
        link.is_active = False
        link.save()
        return ApiV2OKJsonResponse("app 下架成功", data={})


class ModifyLightAppLogoView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    @method_decorator(esb_required_v2)
    def dispatch(self, *args, **kwargs):
        return super(ModifyLightAppLogoView, self).dispatch(*args, **kwargs)

    def post(self, request):
        form = LightAppLogoModifiedForm(get_post_data(request))
        if not form.is_valid():
            message = first_error_message(form)
            return ApiV2FailJsonResponse(message, code=ApiErrorCodeEnumV2.PARAM_NOT_VALID.value)

        is_ok, link = UsefulLinks.objects.is_useful_link(form.cleaned_data["bk_light_app_code"])

        try:
            link.logo = generate_file_by_base64(form.cleaned_data["logo"])
            link.save()
        except Exception as e:
            # 保存logo时出错
            logger.exception(u"save app logo fail: %s" % e)
            return ApiV2FailJsonResponse("logo 数据格式不合法", code=ApiErrorCodeEnumV2.PARAM_NOT_VALID.value)

        return ApiV2OKJsonResponse("app logo修改成功", data={})
