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

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from account.decorators import login_exempt
from api.decorators import esb_required_v2
from api.utils import InnerFeedBackClassV2
from app.models import App


@csrf_exempt
@login_exempt
@esb_required_v2()
def get_app_info(request):
    feedback = InnerFeedBackClassV2()

    is_en = request.META.get("HTTP_BLUEKING_LANGUAGE") == "en"

    app_code = request.GET.get("target_app_code")
    fields = request.GET.get("fields")
    all_app = App.objects.filter(is_lapp=False)
    # 过滤查询的app_code
    if app_code:
        filter_app_code_list = app_code.split(";")
        all_app = all_app.filter(code__in=filter_app_code_list)

    support_fields = ["introduction", "creator", "developer", "tag"]
    extra_fields_set = set(fields.split(";")) & set(support_fields) if fields else set()

    # 按照创建时间逆排序
    all_app = all_app.order_by("-created_date")

    # if developers, get all app developers from iam
    app_code_developers = {}
    # if 'developer' in extra_fields_set:
    # app_code_list = [app.code for app in all_app]
    # TODO: get developers from iam, it's too slow, don't support it now

    app_list = []
    for app in all_app:
        item = {
            "bk_app_code": app.code,
        }
        if is_en:
            item["bk_app_name"] = app.name_en or app.code
        else:
            item["bk_app_name"] = app.name

        if "introduction" in extra_fields_set:
            item["introduction"] = app.introduction_en if is_en else app.introduction

        if "creator" in extra_fields_set:
            item.update({"creator": app.creater})

        if "developer" in extra_fields_set:
            # item.update({'developer': app.developer_str})
            developers = app_code_developers.get(app.code, [])
            item.update({"developer": ";".join(developers)})

        if "tag" in extra_fields_set:
            if app.tags:
                item.update({"tag": app.tags.to_dict()})
            else:
                item.update({"tag": {}})

        app_list.append(item)

    feedback["data"] = app_list

    return JsonResponse(feedback.get_json())
