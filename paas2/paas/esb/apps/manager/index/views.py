# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.views.generic import View

from common.decorators import has_apigateway_manage_permission_for_classfunc
from esb.configs.default import menu_items
from esb.common.django_utils import get_cur_language
from ..utils import md2html


menu_active_item = "manager_index"


class IndexView(View):
    """Index page"""

    @has_apigateway_manage_permission_for_classfunc
    def get(self, request):
        cur_language = get_cur_language()
        return render(
            request,
            "manager/index.html",
            {
                "menu_items": menu_items,
                "menu_active_item": menu_active_item,
                "index_html": md2html("%s/index" % cur_language),
            },
        )
