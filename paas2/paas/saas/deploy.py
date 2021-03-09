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

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import ugettext as _

from account.decorators import login_exempt
from common.mymako import render_json
from release.utils import _get_event_status
from saas.models import SaaSApp
from saas.utils import saas_online_task


@csrf_exempt
@login_exempt
def deploy_app(request):
    """
    部署SaaS应用API

    返回格式：
    {"result": False, "msg": u"错误消息"}
    {"result": True, "msg": '', "event_id": u"部署事件id,用于查询部署状态"}
    """
    try:
        req_data = json.loads(request.body)
    except Exception as e:
        return render_json({"result": False, "msg": _(u"解析参数出错:%s") % e})

    app_code = req_data.get("app_code")
    if not app_code:
        return render_json({"result": False, "msg": _(u"缺少参数:app_code")})

    try:
        saas_app = SaaSApp.objects.get(code=app_code)
    except Exception:
        return render_json({"result": False, "msg": _(u"应用[%s]数据信息未初始化") % app_code})

    # 获取应用的版本信息

    app_version = saas_app.get_deployable_version()
    saas_app_version_id = app_version.id if app_version else None
    result = saas_online_task(saas_app_version_id, "admin", is_back=True)
    return render_json(result)


@csrf_exempt
@login_exempt
def query_deploy_status(request):
    """
    查询部署状态

    返回格式：
    {"result": 2, "data": u"部署日志"}
    result：0：失败，1：成功，2：正在执行
    """
    try:
        req_data = json.loads(request.body)
    except Exception as e:
        return render_json({"result": False, "msg": _(u"解析参数出错:%s") % e})

    app_code = req_data.get("app_code")
    event_id = req_data.get("event_id")
    expire_seconds = req_data.get("expire_seconds")

    try:
        expire_seconds = int(expire_seconds)
    except Exception:
        expire_seconds = settings.EVENT_STATE_EXPIRE_SECONDS
    event_result = _get_event_status(event_id, app_code, expire_seconds=expire_seconds)
    return render_json(event_result)
