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

from builtins import str
import time
import uuid

from django.utils import timezone
from django.conf import settings
from django.db import transaction
from django.http import HttpResponseRedirect
from django.utils.translation import ugettext as _

from app.constants import AppStateEnum, OPENMODE_CHOICES, OPENMODE_DICT
from app.models import App, AppTags
from app.validators import validate_app_code, validate_app_name, validate_external_url, validate_app_tags
from app.utils import parse_app_visiable_labels
from common.decorators import app_exists, has_app_develop_permission
from common.log import logger
from common.mymako import render_mako_context, render_json, render_mako_tostring_context
from common.constants import DESKTOP_DEFAULT_APP_WIDTH, DESKTOP_DEFAULT_APP_HEIGHT
from common.record import record_user_operate
from common.bk_iam import Permission

from release.constants import UserOperateTypeEnum, OperateIDEnum
from release.models import Record
from bk_iam.utils import apply_app_creator_permission


def tpapp_list_page(request):
    """
    集成应用 列表
    """
    return render_mako_context(request, "tpapp/list.html", {})


def query_app_list(request):
    """
    查询获得集成应用的列表
    """
    username = request.user.username
    keyword = request.GET.get("keyword").replace("&nbsp;", "").strip()

    try:
        hide_outline = int(request.GET.get("hide_outline", "0"))
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 8))
    except Exception as e:
        # 应用列表页面参数异常:%s
        logger.exception(u"query app list param is invalid: %s" % e)
        return render_json({"data": _(u"请求参数异常"), "total_num": 0, "extend_fun": ""})

    # get app_list from iam
    user_app_list = Permission().app_list(username)

    total, app_list = App.objects.query_app_list(
        user_app_list=user_app_list,
        keyword=keyword,
        hide_outline=hide_outline,
        is_saas=False,
        is_lapp=False,
        is_third=True,
        page=page,
        page_size=page_size,
    )

    has_app = total > 0
    has_conditions = request.GET.get("keyword") is not None

    data = {
        "total": total,
        "app_list": app_list,
    }
    template_name = "tpapp/list_table.part" if (has_app or has_conditions) else "tpapp/list_tip.part"
    html_data = render_mako_tostring_context(request, template_name, data)
    return render_json({"data": html_data, "total_num": total, "extend_fun": ""})


def create_app(request):
    """
    创建应用.

    Get请求到创建页面，post页面则保存应用信息后到基本信息页面
    """
    if request.method == "GET":
        tags = AppTags.objects.get_all_tags()
        error = request.GET.get("error", "")
        context = dict(error=error, tags=tags)
        return render_mako_context(request, "tpapp/create.html", context)
    else:
        return _save_app(request)


def _save_app(request):
    """
    新建应用
    """
    creater = request.user.username
    # 获取参数
    code = request.POST.get("code", "").replace("&nbsp;", " ").strip()
    name = request.POST.get("name", "").replace("&nbsp;", " ").strip()
    introduction = request.POST.get("introduction", "").replace("&nbsp;", " ").strip()
    app_tags = request.POST.get("app_tags")
    external_url = request.POST.get("external_url", "").replace("&nbsp;", " ").strip()

    # validate
    error_url = u"%stpapp/create/?error={error}" % settings.SITE_URL
    is_code_valid, code_msg = validate_app_code(code)
    if not is_code_valid:
        return HttpResponseRedirect(error_url.format(error=code_msg))

    is_name_valid, name_msg = validate_app_name(name, "")
    if not is_name_valid:
        return HttpResponseRedirect(error_url.format(error=name_msg))

    is_external_url_valid, external_url_msg = validate_external_url(external_url)
    if not is_external_url_valid:
        return HttpResponseRedirect(error_url.format(error=external_url_msg))

    is_tags_valid, tags_msg, app_tags = validate_app_tags(app_tags)
    if not is_tags_valid:
        return HttpResponseRedirect(error_url.format(error=tags_msg))

    # 保存应用信息到数据库
    try:
        token = str(uuid.uuid4())
        with transaction.atomic():
            App.objects.create(
                name=name,
                code=code,
                introduction=introduction,
                external_url=external_url,
                creater=creater,
                is_third=True,
                tags=app_tags,
                auth_token=token,
            )

        # NOTE: apply for iam authorization
        apply_app_creator_permission(app_code=code, app_name=name, username=creater)

    except Exception as e:
        # 创建应用时，保存应用基本信息出错:%s
        logger.exception(u"save tpapp base info fail: %s" % e)
        return HttpResponseRedirect(error_url.format(error=_(u"保存应用基本信息出错")))
    return HttpResponseRedirect("%stpapp/info/%s/" % (settings.SITE_URL, code))


@app_exists
@has_app_develop_permission
def info(request, app_code):
    """
    应用基本信息
    """
    app_info = {}
    app = App.objects.get(code=app_code)

    # 获取应用分类列表
    tags = AppTags.objects.get_all_tags()
    # 获取开发者信息
    # get app_developers from iam
    # app_developers = Permission().app_developers(app_code)
    # developers = subjects_display(app_developers)
    developers = "--"

    token = "--" if app.code in ("bk_cmdb", "bk_job") else (app.auth_token or "--")

    # 解析APP信息
    app_info = {
        "code": app.code,
        "auth_token": token,
        "creater": app.creater_display or "",
        "name": app.name_display or "",
        "state": app.state,
        "state_display": app.tpapp_state_display,
        "tags": _(app.tags.name) if app.tags else "",
        "tags_code": app.tags.code if app.tags else "",
        "create_time": app.created_time_display,
        "first_online_time": app.first_online_time_display or "",
        "introduction": app.introduction_display or "",
        "developers": developers,
        "width": app.width or DESKTOP_DEFAULT_APP_WIDTH,
        "height": app.height or DESKTOP_DEFAULT_APP_HEIGHT,
        "is_max": 1 if app.is_max else 0,
        "external_url": app.external_url,
        "open_mode": app.open_mode,
        "open_mode_name": _(OPENMODE_DICT.get(app.open_mode)) or "",
        "visiable_labels": parse_app_visiable_labels(app.visiable_labels),
    }
    return render_mako_context(
        request,
        "tpapp/info.html",
        {
            "app_info": app_info,
            "app_code": app_code,
            "tags": tags,
            "open_mode_choices": OPENMODE_CHOICES,
        },
    )


@app_exists
@has_app_develop_permission
def online_page(request, app_code):
    """
    部署页面
    """
    app = App.objects.get(code=app_code)
    data = {
        "external_url": app.external_url,
        "app_code": app_code,
        "app_state": app.state,
        "is_already_online": app.is_already_online,
    }
    return render_mako_context(request, "tpapp/release/online.html", data)


@app_exists
@has_app_develop_permission
def offline_page(request, app_code):
    """
    部署页面
    """
    app = App.objects.get(code=app_code)
    data = {
        "external_url": app.external_url,
        "app_code": app_code,
        "app_state": app.state,
        "is_already_online": app.is_already_online,
    }
    return render_mako_context(request, "tpapp/release/offline.html", data)


@app_exists
@has_app_develop_permission
def release_task_excute(request, app_code):
    """
    部署/下架操作
    """
    username = request.user.username

    app = App.objects.get(code=app_code)

    # 平台内置应用（配置平台和作业平台不可下架）
    if app.is_platform:
        return render_json({"result": False, "message": _(u"蓝鲸内置的平台应用，不可下架!")})

    mode = request.POST.get("mode")
    if mode == "online":
        operate_id = OperateIDEnum.TO_ONLINE
        operate_type = UserOperateTypeEnum.RELEASE_ONLINE
    elif mode == "offline":
        operate_id = OperateIDEnum.TO_OUTLINE
        operate_type = UserOperateTypeEnum.RELEASE_OUTLINE

    try:
        with transaction.atomic():
            # 记录版本
            record = Record.objects.create_record(
                app_code=app_code,
                app_old_state=app.state,
                operate_user=username,
                operate_id=operate_id,
                is_success=True,
            )
            record.event_id = record.id
            record.save()
            if mode == "online":
                # 修改状态
                App.objects.filter(code=app_code).update(state=AppStateEnum.ONLINE, is_already_online=True)
                if not app.first_online_time:
                    App.objects.filter(code=app_code).update(first_online_time=timezone.now())
            elif mode == "offline":
                # 修改状态
                App.objects.filter(code=app_code).update(state=AppStateEnum.OUTLINE, is_already_online=False)
            # 操作流水日志
            record_user_operate(app_code=app_code, username=username, operate_type=operate_type)
    except Exception as e:
        # 部署应用时出错:%s
        logger.exception(u"deploy tpapp fail:%s" % e)
        return render_json({"result": False, "message": _(u"数据库操作失败，请查询PaaS日志信息!")})

    # 延迟返回，前端lodding
    time.sleep(1)
    return render_json({"result": True})


@app_exists
@has_app_develop_permission
def record_page(request, app_code):
    """
    应用发布记录
    """
    app = App.objects.get(code=app_code)
    app_state = app.state
    return render_mako_context(request, "tpapp/release/record.html", {"app_code": app_code, "app_state": app_state})


@app_exists
@has_app_develop_permission
def get_record_list(request, app_code, operate_code):
    """
    获取发布记录页面

    operate_id: 操作对应ID, 0: 全部，2：上线，3：下架
    """
    # NOTE: 可能存在的问题, 这里operate_code=0时, 无 TO_TEST和IN_TEST状态, 但是貌似没影响, 先全部返回
    record_list = Record.objects.get_record_list(
        app_code=app_code,
        operate_code=operate_code,
    )
    result = {
        "record_list": record_list,
        "app_code": app_code,
    }
    return render_mako_context(request, "tpapp/release/record_list.part", result)
