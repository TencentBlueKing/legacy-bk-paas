# -*- coding: utf-8 -*-
import copy
import markdown
from markdown.extensions.headerid import HeaderIdExtension
from django.views.generic import View
from django.shortcuts import render
from django.utils.translation import ugettext as _

from common.decorators import has_apigateway_manage_permission_for_classfunc
from esb.configs.default import menu_items
from esb.common.django_utils import get_cur_language
from .utils import mdfile_by_name

menu_active_item = "user_guide"


PAGES = [
    ("esb_introduction", _(u"API网关介绍")),
    ("add_new_component", _(u"组件编码")),
    ("buffet_component", _(u"自助接入")),
    ("use_component", _(u"API调用说明")),
    ("custom_conf_manage", _(u"自定义配置管理")),
    ("cmsi_component_guide", _(u"CMSI消息组件")),
]

ZH_PAGES = copy.deepcopy(PAGES)
ZH_PAGES.extend(
    [
        ("weixin_component_guide", _(u"微信消息组件")),
    ]
)


class Page(View):
    @has_apigateway_manage_permission_for_classfunc
    def get(self, request, name):
        with open(mdfile_by_name(name)) as fp:
            md_content = unicode(fp.read(), "utf-8")

            html_part = markdown.markdown(
                md_content,
                extensions=[
                    "tables",
                    "attr_list",
                    "fenced_code",
                    HeaderIdExtension(level=1),
                    "markdown.extensions.codehilite",
                    "markdown.extensions.toc",
                ],
            )
        cur_language = get_cur_language()

        return render(
            request,
            "guide/page.html",
            {
                "pages": ZH_PAGES if cur_language == "zh-hans" else PAGES,
                "current_page": name,
                "html_part": html_part,
                "menu_items": menu_items,
                "menu_active_item": menu_active_item,
            },
        )
