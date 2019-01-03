# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.core.exceptions import ImproperlyConfigured
from django.http import JsonResponse
from django.template.response import TemplateResponse
from django.views.generic import View
from django.views.generic.base import ContextMixin

from common.mymako import render_mako_context


# MakoTemplateView

class MakoTemplateResponseMixin(object):
    template_name = None
    template_engine = None
    response_class = TemplateResponse
    content_type = None

    def get_template_names(self):
        """
        Returns a list of template names to be used for the request. Must return
        a list. May not be called if render_to_response is overridden.
        """
        if self.template_name is None:
            raise ImproperlyConfigured(
                "MakoTemplateResponseMixin requires either a definition of "
                "'template_name' or an implementation of 'get_template_names()'")
        else:
            return [self.template_name]

    def render_to_response(self, context):
        # use the same function name as Django, but adapt to Mako
        template_names = self.get_template_names()

        if isinstance(template_names, (list, tuple)):
            template_name = template_names[0]
        elif isinstance(template_names, basestring):
            template_name = template_names
        else:
            raise ValueError("template_names should be string or tuple/list")

        return render_mako_context(self.request, template_name, context)


class MakoTemplateView(MakoTemplateResponseMixin, ContextMixin, View):
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


# JsonView

class JsonResponseMixin(object):
    def render_to_response(self, request, context):
        # remove view from the get_context_data
        if ('view' in context) and isinstance(context['view'], View):
            del context['view']
        return JsonResponse(context)


class JsonView(JsonResponseMixin, ContextMixin, View):
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(request, context)
