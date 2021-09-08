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

from django.shortcuts import render

from esb.configs.default import menu_items, BK_APIGW_URL, APIGATEWAY_ENABLED


class TemplateRenderMixin(object):
    def _get_generic_context(self):
        return {
            "menu_items": menu_items,
            "BK_APIGW_URL": BK_APIGW_URL,
            "APIGATEWAY_ENABLED": APIGATEWAY_ENABLED,
        }

    def render(self, request, template_name, context=None, *args, **kwargs):
        context = context or {}

        for key, value in self._get_generic_context().items():
            context.setdefault(key, value)

        return render(request, template_name, context, *args, **kwargs)
