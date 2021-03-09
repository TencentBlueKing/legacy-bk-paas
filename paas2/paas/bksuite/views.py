# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from common.decorators import has_system_ops_permission
from common.mymako import render_mako_context

from bksuite.utils import get_all_production_info


@has_system_ops_permission
def home(request):
    """
    产品版本信息页面
    """
    all_production = get_all_production_info()
    return render_mako_context(request, "bksuite/home.html", {"all_production": all_production})
