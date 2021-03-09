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

from django.utils.translation import ugettext as _

from blueking.component.shortcuts import get_client_by_request
from common.decorators import app_exists, has_app_develop_permission_or_is_smart_admin
from common.mymako import render_mako_context, render_json
from common.log import logger
from app_esb_auth.constants import ESB_API_AUTH_LEVEL_DICT
from app_esb_auth.models import EsbAuthApplyReocrd


@app_exists
@has_app_develop_permission_or_is_smart_admin
def home(request, app_code):
    """
    ESB权限申请 - 首页
    """
    base_tpl = "/base_app.html"
    if request.GET.get("is_saas") == "1":
        base_tpl = "/base_saas.html"
    elif request.GET.get("is_tpapp") == "1":
        base_tpl = "/base_tpapp.html"
    esb_system = request.GET.get("esb_system", "")

    # 获取组件所有系统
    client = get_client_by_request(request)
    esb_result = client.esb.get_systems({})
    if not esb_result.get("result", False):
        # 调用组件查询组件系统列表出错
        logger.error(
            u"An error occurred in calling component query component system list: %s" % esb_result.get("message", "")
        )
    esb_sys_list = esb_result.get("data", []) if esb_result.get("result", False) else []
    result = {
        "app_code": app_code,
        "base_tpl": base_tpl,
        "esb_sys_list": esb_sys_list,
        "esb_system": esb_system,
    }
    return render_mako_context(request, "app_esb_auth/home.html", result)


@app_exists
@has_app_develop_permission_or_is_smart_admin
def get_esb_api(request, app_code, sys_name):
    """
    通过组件系统名称获取该系统的api
    """
    # 获取组件API
    client = get_client_by_request(request)
    kwargs = {"system_name": sys_name, "searched_app_code": app_code}
    esb_result = client.esb.get_components(kwargs)
    if not esb_result.get("result", False):
        # 调用组件查询组件系统API列表出错
        logger.error(
            u"An error occurred in calling component query component system API list: %s"
            % esb_result.get("message", "")
        )
    esb_api_list = esb_result.get("data", []) if esb_result.get("result", False) else []

    # 总共api数量
    total_api = len(esb_api_list)

    # 获取组件申请记录
    all_apply_record = EsbAuthApplyReocrd.objects.filter(app_code=app_code, sys_name=sys_name).order_by("id")
    api_apply_status_dict = dict([(i.api_id, i.approval_result) for i in all_apply_record])

    esb_api_by_level = {}
    # 将组件API按照权限级别分类，并添加每个api的申请状态
    for i in esb_api_list:
        i["apply_status"] = api_apply_status_dict.get(i["id"], "unapply")
        if i["perm_level"] not in esb_api_by_level:
            esb_api_by_level[i["perm_level"]] = []
        esb_api_by_level[i["perm_level"]].append(i)

    total_level_api = dict([(i, len(esb_api_by_level[i])) for i in esb_api_by_level])

    ctx = {
        "app_code": app_code,
        "sys_name": sys_name,
        "total_api": total_api,
        "total_level_api": total_level_api,
        "ESB_API_AUTH_LEVEL_DICT": ESB_API_AUTH_LEVEL_DICT,
        "esb_api_by_level": esb_api_by_level,
    }
    return render_mako_context(request, "app_esb_auth/esb_sys_api.part", ctx)


@app_exists
@has_app_develop_permission_or_is_smart_admin
def esb_api_auth_apply(request, app_code, sys_name):
    """
    组件权限申请
    """
    username = request.user.username
    api_id = int(request.POST.get("api_id"))
    api_name = request.POST.get("api_name")
    if EsbAuthApplyReocrd.objects.is_api_already_applied(app_code, sys_name, api_id):
        return render_json({"result": False, "message": _(u"您已申请过该组件API")})

    EsbAuthApplyReocrd.objects.create(
        operator=username, app_code=app_code, sys_name=sys_name, api_id=api_id, api_name=api_name
    )
    return render_json({"result": True, "message": ""})


@app_exists
@has_app_develop_permission_or_is_smart_admin
def esb_api_auth_batch_apply(request, app_code, sys_name):
    """
    组件权限批量申请
    """
    username = request.user.username

    api_list = request.POST.get("api_list")
    if not api_list:
        return render_json({"result": False, "message": _(u"无效的API列表参数")})

    for api_data in api_list.split(","):
        api_id, api_name = api_data.split(":")
        if EsbAuthApplyReocrd.objects.is_api_already_applied(app_code, sys_name, api_id):
            continue

        EsbAuthApplyReocrd.objects.create(
            operator=username, app_code=app_code, sys_name=sys_name, api_id=api_id, api_name=api_name
        )

    return render_json({"result": True, "message": "success"})
