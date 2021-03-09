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
