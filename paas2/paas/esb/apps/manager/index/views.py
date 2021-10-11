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

from django.views.generic import View

from common.decorators import has_apigateway_manage_permission_for_classfunc
from esb.apps.mixins import TemplateRenderMixin
from esb.common.django_utils import get_cur_language
from ..utils import md2html


menu_active_item = "manager_index"


class IndexView(View, TemplateRenderMixin):
    """Index page"""

    @has_apigateway_manage_permission_for_classfunc
    def get(self, request):
        cur_language = get_cur_language()
        return self.render(
            request,
            "manager/index.html",
            {
                "menu_active_item": menu_active_item,
                "index_html": md2html("%s/index" % cur_language),
            },
        )
