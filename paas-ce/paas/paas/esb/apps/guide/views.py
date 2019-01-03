# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

import copy
import markdown
from markdown.extensions.headerid import HeaderIdExtension
from django.views.generic import View
from django.shortcuts import render
from django.utils.translation import ugettext as _

from .utils import mdfile_by_name
from esb.common.decorators import is_user_super
from esb.configs.default import menu_items
from esb.common.django_utils import get_cur_language

menu_active_item = 'user_guide'


PAGES = [
    ('esb_introduction', _(u'API网关介绍')),
    ('add_new_component', _(u'组件编码')),
    ('buffet_component', _(u'自助接入')),
    ('use_component', _(u'API调用说明')),
    ('custom_conf_manage', _(u'自定义配置管理')),
    ('cmsi_component_guide', _(u'CMSI消息组件')),
]

ZH_PAGES = copy.deepcopy(PAGES)
ZH_PAGES.extend([
    ('weixin_component_guide', _(u'微信消息组件')),
])


class Page(View):

    @is_user_super
    def get(self, request, name):
        with open(mdfile_by_name(name)) as fp:
            md_content = unicode(fp.read(), 'utf-8')

            html_part = markdown.markdown(
                md_content,
                extensions=[
                    'tables',
                    'attr_list',
                    'fenced_code',
                    HeaderIdExtension(level=1),
                    'markdown.extensions.codehilite',
                    'markdown.extensions.toc'
                ],
            )
        cur_language = get_cur_language()

        return render(request, 'guide/page.html', {
            'pages': ZH_PAGES if cur_language == 'zh-hans' else PAGES,
            'current_page': name,
            'html_part': html_part,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })
