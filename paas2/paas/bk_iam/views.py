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


import json

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db.models import Q
from django.conf import settings

from account.decorators import login_exempt
from app.models import App
from bk_iam.utils import OKJsonResponse, FailJsonResponse
from bk_iam.decorators import basic_auth_required
from iam import DjangoQuerySetConverter


# Create your views here.
@basic_auth_required
@require_POST
@csrf_exempt
@login_exempt
def resources(request):
    """
    the func for iam/api/v1
    """
    body = request.body
    try:
        data = json.loads(body)
    except Exception:
        return FailJsonResponse(400, "load json fail")

    method = data.get("method")
    _type = data.get("type")
    if not (method and _type):
        return FailJsonResponse(400, "type and method required")

    # No these methods
    if method == "list_attr":
        return OKJsonResponse([])
    if method == "list_attr_value":
        return OKJsonResponse({})

    is_en = request.META.get("HTTP_BLUEKING_LANGUAGE") == "en"

    if method == "fetch_instance_info":
        return fetch_instance_info(data)
    elif method == "list_instance":
        return list_instance(data, is_en)
    elif method == "list_instance_by_policy":
        return list_instance_by_policy(data, is_en)
    elif method == "search_instance":
        return search_instance(data, is_en)

    return OKJsonResponse(None)


def list_instance(data, is_en):
    """
    input
    {
        "type": "host",
        "method": "list_instance",
        "page": {
            "limit": 20,
            "offset": 0
        }
    }

    return
    """
    return _do_query_instance(data, is_en)


def search_instance(data, is_en):
    """
    input
    {
        "type": "host",
        "method": "search_instance",
        "filter": {
            "keyword": "x"
        },
        "page": {
            "limit": 20,
            "offset": 0
        }
    }

    return
    """
    keyword = data.get("filter", {}).get("keyword", "")
    return _do_query_instance(data, is_en, keyword)


def _do_query_instance(data, is_en, keyword=""):
    # NOTE: current only support app
    _type = data.get("type")
    if _type != "app":
        return FailJsonResponse(code=400, message="currently type only supported app")

    page_info = data.get("page", {})
    limit = page_info.get("limit", 20)
    offset = page_info.get("offset", 0)

    # TODO: add cache?
    total, app_list = iam_query_app_list(keyword=keyword, limit=limit, offset=offset)

    result = {
        "count": total,
        "results": [{"id": i.code, "display_name": (i.name_en or i.code) if is_en else i.name} for i in app_list],
    }

    return OKJsonResponse(data=result)


def list_instance_by_policy(data, is_en):
    """
    input
    {
        "type": "host",
        "method": "list_instance_by_policy",
        "filter": {
            "expression": {
            }
        },
        "page": {
            "offset": 0,
            "limit": 20
        }
    }
    """
    # validate
    _type = data.get("type")
    if _type != "app":
        return FailJsonResponse(code=400, message="currently type only supported app")

    # page info
    page_info = data.get("page", {})
    limit = page_info.get("limit", 20)
    offset = page_info.get("offset", 0)

    # expression
    expression = data.get("filter", {}).get("expression")
    if not expression:
        result = {"count": 0, "results": []}
        return OKJsonResponse(data=result)

    # make filters
    key_mapping = {"app.id": "code"}
    converter = DjangoQuerySetConverter(key_mapping)
    filters = converter.convert(expression)

    # do filter
    total, app_list = iam_query_app_list_with_filters(filters, limit, offset)

    # make result
    result = {
        "count": total,
        "results": [{"id": i.code, "display_name": (i.name_en or i.code) if is_en else i.name} for i in app_list],
    }
    return OKJsonResponse(data=result)


def fetch_instance_info(data):
    """
    {
        "type": "app",
        "method": "fetch_instance_info",
        "filter": {
            "ids": ["h1", "h2"],
            "attrs": ["path", "os", "country"]
        },
    }
    实现: 返回具体 id 的 实例详情, 支持过滤其中的fields
    """
    _type = data.get("type")
    if _type != "app":
        return FailJsonResponse(code=400, message="currently type only supported app")

    ids = data.get("filter", {}).get("ids")
    if not ids:
        return FailJsonResponse(code=400, message="filter.ids required")

    # NOTE: not support attrs, no attr in iam policy
    app_list = iam_query_app_list_by_ids(ids)

    return OKJsonResponse(data=[{"id": i.code, "display_name": i.name} for i in app_list])


def iam_query_app_list(keyword, limit, offset):
    """
    SaaS和外链应用 => 需要申请权限
    """
    start = offset
    end = offset + limit

    q = App.objects.filter(
        is_saas=False,
        is_lapp=False,
    )

    if settings.EDITION == "ce":
        q = q.filter(is_third=False)

    app_all_list = q.order_by("-created_date").distinct()

    if keyword:
        app_all_list = app_all_list.filter(Q(name__icontains=keyword) | Q(code__icontains=keyword))

    total = app_all_list.count()
    app_list = app_all_list[start:end]

    return total, app_list


def iam_query_app_list_with_filters(filters, limit, offset):
    start = offset
    end = offset + limit

    q = App.objects.filter(filters).filter(
        is_saas=False,
        is_lapp=False,
    )

    if settings.EDITION == "ce":
        q = q.filter(is_third=False)

    app_list = q.all()

    total = app_list.count()
    app_list = app_list[start:end]
    return total, app_list


def iam_query_app_list_by_ids(ids):
    """
    SaaS和外链应用 => 需要申请权限
    """
    app_list = App.objects.filter(
        is_saas=False,
        is_lapp=False,
        # is_third=False,
        code__in=ids,
    ).all()

    return app_list
