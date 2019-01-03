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
from django.utils.translation import ugettext as _
from django.http import QueryDict

from app_env.constants import ENV_MODE_TYPE_CHOICES, MODE_CHOICE_HTML
from app_env.forms import AppEnvForm
from app_env.models import AppEnvVar
from common.decorators import escape_exempt
from common.exceptions import BadRequestException
from common.log import logger
from common.mixins.base import AppDeveloperRequiredMixin
from common.responses import FailJsonResponse, OKJsonResponse
from common.utils import first_error_message
from common.views.mako import MakoTemplateView


class AppEnvView(AppDeveloperRequiredMixin, MakoTemplateView):
    @method_decorator(escape_exempt)
    def dispatch(self, *args, **kwargs):
        return super(AppEnvView, self).dispatch(*args, **kwargs)

    template_name = 'app_env/home.html'

    def get_context_data(self, **kwargs):
        context = super(AppEnvView, self).get_context_data(**kwargs)
        app_code = self.kwargs["app_code"]

        data = {'app_code': app_code, 'is_allow': True, "base_tpl": "/base_app.html"}

        env_vars = AppEnvVar.objects.filter(app_code=app_code).all()
        data['env_vars'] = env_vars

        trans_dict = []
        for k, v in ENV_MODE_TYPE_CHOICES:
            trans_dict.append((k, _(v)))

        data['mode_choices'] = trans_dict
        data['mode_choices_html'] = MODE_CHOICE_HTML

        context.update(data)
        return context

    def _add_or_update(self, request, app_code, var_id=None):
        if not var_id:
            form = AppEnvForm(request.POST)
        else:
            put = QueryDict(request.body)
            form = AppEnvForm(put)

        if not form.is_valid():
            message = first_error_message(form)
            # print form.errors
            raise BadRequestException(message)

        #  app_code = form.cleaned_data["app_code"]
        name = form.cleaned_data["name"]
        value = form.cleaned_data["value"]
        intro = form.cleaned_data["intro"]
        mode = form.cleaned_data["mode"]

        name = 'BKAPP_%s' % name

        # do add
        if not var_id:
            if AppEnvVar.objects.exists(app_code, mode, name):
                message = "变量名已经存在, 请勿重复添加!"
                return FailJsonResponse(message)

            try:
                env_var = AppEnvVar.objects.create(app_code=app_code, mode=mode, name=name,
                                                   value=value, intro=intro)

                var_id = env_var.id
            except Exception:
                # 保存app环境变量异常
                message = "保存app环境变量失败"
                logger.exception(message)
                return FailJsonResponse(message)
        # do update
        else:
            if AppEnvVar.objects.update_target_exists(app_code, mode, name, var_id):
                message = "同名变量已经存在! 无法对当前变量进行更新"
                return FailJsonResponse(message)

            AppEnvVar.objects.update(var_id, name, value, intro, mode)

        return OKJsonResponse("保存变量成功", id=var_id)

    def post(self, request, app_code):
        return self._add_or_update(request, app_code)

    def put(self, request, app_code, var_id):
        return self._add_or_update(request, app_code, var_id)

    def delete(self, request, app_code, var_id):
        try:
            AppEnvVar.objects.filter(id=var_id).delete()
        except Exception:
            logger.exception("删除app环境变量失败")
            return FailJsonResponse("删除app环境变量失败")
        return OKJsonResponse("删除成功")
