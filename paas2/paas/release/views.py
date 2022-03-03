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

from django.utils import timezone
from django.conf import settings
from django.views.decorators.http import require_POST, require_GET
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_exempt

from account.decorators import login_exempt
from api.decorators import bk_paas_backend_required
from common.mymako import render_mako_context, render_json
from common.record import record_user_operate
from common.log import logger
from common.decorators import app_exists, has_app_develop_permission, has_app_develop_or_smart_develop_permission
from engine.deploy import app_to_test_task, app_to_online_task, app_to_outline_task
from engine.api import get_event_log
from engine.models import BkApp, BkServer, ThirdServer
from engine.utils import get_app_prod_deploy_servers, random_choose_servers
from app.models import App, SecureInfo
from app.constants import AppStateEnum
from release.models import Record, Version
from release.constants import UserOperateTypeEnum, OperateIDEnum, EventStatusEnum
from release.utils import _get_event_status, get_release_home_page_data
from audit.utils import record_audit_log
from audit.constants import AuditEventOperationTypeEnum, AuditSystemEnum, AuditOPObjectTypeEnum


@app_exists
@has_app_develop_permission
def home(request, app_code):
    """
    发布部署 - 首页
    """
    result = get_release_home_page_data(app_code, request.user.username)
    return render_mako_context(request, "release/home.html", result)


@app_exists
@has_app_develop_permission
def unrelease_page(request, app_code):
    """
    发布部署 - 首页
    """
    result = get_release_home_page_data(app_code, request.user.username, page="unrelease")
    return render_mako_context(request, "release/home.html", result)


@app_exists
@has_app_develop_permission
def record(request, app_code):
    """
    发布记录
    """
    return render_mako_context(request, "release/record.html", {"app_code": app_code, "tab": "record"})


# @has_app_develop_permission
@app_exists
@has_app_develop_or_smart_develop_permission
def get_app_record(request, app_code, operate_code):
    """
    获取发布记录页面

    operate_id: 操作对应ID, 0: 全部， 1：提测，  2：上线，3：下架
    """
    record_list = Record.objects.get_record_list(
        app_code=app_code,
        operate_code=operate_code,
    )
    result = {
        "record_list": record_list,
        "app_code": app_code,
    }
    return render_mako_context(request, "release/record_list.part", result)


@app_exists
@has_app_develop_permission
def version(request, app_code):
    """
    版本信息
    app发布历史版本
    """
    app = App.objects.get(code=app_code)

    version_list = Version.objects.get_version_list(app=app)
    result = {"app_code": app_code, "version_list": version_list, "tab": "version"}
    return render_mako_context(request, "release/version.html", result)


@app_exists
@has_app_develop_permission
def get_deploy_page(request, page_type, app_code):
    """
    获取部署页面信息
    """
    app = App.objects.get(code=app_code)
    try:
        secure_info = SecureInfo.objects.get(app_code=app_code)
    except Exception:
        # 应用[%s]的源码信息不存在
        logger.exception(u"Source code information of app [%s] does not exist " % app_code)
        secure_info = None

    result = {
        "app": app,
        "vcs_url": secure_info.vcs_url if secure_info else "--",  # 地址为空时显示‘--’
        "vcs_type": secure_info.vcs_type_text if secure_info else "",
        "app_code": app_code,
    }
    # if is git and developer has set the checkout_target before, show in input field as default
    # if not, default value is master
    if secure_info and secure_info.vcs_type_text == "git":
        checkout_target = secure_info.vcs_checkout_target or "master"
        result.update({"checkout_target": checkout_target})

    if page_type == "test_form":

        result.update({"is_service_rabbitmq_active": ThirdServer.objects.is_service_rabbitmq_active()})

    if page_type == "online_form":
        hostships, servers = get_app_prod_deploy_servers(app_code)
        if not hostships and servers:
            hostships = random_choose_servers(servers)
        result.update({"servers": servers, "hostships": hostships})

    tpl = {
        "test_form": "release/test_form.part",
        "online_form": "release/online_form.part",
        "outline_form": "release/outline_form.part",
    }.get(page_type, "release/outline_form.part")

    return render_mako_context(request, tpl, result)


@app_exists  # NOQA
@has_app_develop_permission
@require_POST
def release_test(request, app_code):
    """
    app提测
    """
    logger.info(u"[app:%s] Start to carry out [test deployment]..." % app_code)

    username = request.user.username

    app = App.objects.get(code=app_code)

    # 检测测试服务器是否激活
    if not BkServer.objects.check_test_app_deployable():
        msg = (
            "Currently there is no [test server] available, so submission for test cannot be done. "
            "Register and activate your server at <a href='/engine/servers/'> "
            "[BlueKing - Developer Center - Server Info] </a>) "
        )
        logger.info(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"当前没有可用的[测试服务器], 无法进行提测操作. 请到<a href='/engine/servers/'> [蓝鲸智云-开发者中心-服务器信息] </a> 注册并激活服务器")
        result = {"result": False, "msg": msg}
        return render_json(result)

    # 只有[下架/开发/测试/上线]状态可操作
    if app.state not in [AppStateEnum.OUTLINE, AppStateEnum.DEVELOPMENT, AppStateEnum.TEST, AppStateEnum.ONLINE]:
        msg = "Current status of the app is:%s, it is unable to carry out submission for testing actions" % (
            app.state_display
        )
        logger.info(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"应用当前状态为：%s，不能进行提测操作！") % (app.state_display)
        result = {"result": False, "msg": msg}
        return render_json(result)

    # 启用服务
    origin_form_data = request.POST.get("form_data", None)
    if origin_form_data:
        try:
            form_data = json.loads(origin_form_data)
        except Exception:
            logger.exception("parse form_data fail")
            form_data = None

        # celery settings
        if form_data and ThirdServer.objects.is_service_rabbitmq_active():
            try:
                app.is_use_celery = form_data.get("is_use_celery") == "checked"
                app.is_use_celery_beat = form_data.get("is_use_celery_beat") == "checked"
                app.save()
                logger.info(
                    "update app info [is_use_celery=%s, is_use_celery_beat=%s]"
                    % (app.is_use_celery, app.is_use_celery_beat)
                )
            except Exception:
                logger.exception("Update is_use_celery/is_use_celery_beat fail!")

        # vcs checkout_target
        # tag or branch => a input field => will do validate
        # should save it to somewhere, the developer can change it before deploy, only save once
        if form_data:
            try:
                secure_info = SecureInfo.objects.get(app_code=app_code)
            except Exception:
                # 应用[%s]的源码信息不存在
                logger.exception(u"Source code information of app [%s] does not exist " % app_code)
                secure_info = None

            if secure_info and secure_info.vcs_type_text == "git":
                try:
                    checkout_target = form_data.get("checkout_target", "master")
                    if checkout_target:
                        secure_info.vcs_checkout_target = checkout_target
                        secure_info.save()

                        logger.info("update app secure info [checkout_target=%s]", checkout_target)
                    else:
                        logger.info("update app secure info fail [checkout_target=%s]", checkout_target)
                except Exception:
                    logger.exception("Update checkout_target fail!")

    # 提测
    is_success, event_id, message = app_to_test_task(app_code, app, username)

    # 记录操作流水日志
    extra_data = {"username": username, "is_success": is_success, "event_id": event_id}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.RELEASE_TEST, extra_data=extra_data
    )

    if is_success:
        msg = _(u"测试部署事件提交成功！")
        result = {"result": True, "msg": msg, "event_id": event_id}
    else:
        msg = message
        result = {"result": False, "msg": msg, "event_id": event_id}

    logger.info(u"[app:%s] %s event_id: %s" % (app_code, msg, event_id))
    return render_json(result)


@app_exists
@has_app_develop_permission
@require_POST
def release_online(request, app_code):
    """
    app上线
    """
    logger.info(u"[app:%s] Start to carry out [production deployment]..." % app_code)

    username = request.user.username

    app = App.objects.get(code=app_code)
    try:
        form_data = json.loads(request.POST.get("form_data", "{}"))
    except Exception:
        msg = u"Parameters error!"
        logger.exception(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"参数错误！")
        result = {"result": False, "msg": msg, "event_id": ""}
        return render_json(result)

    if not BkServer.objects.check_prod_app_deployable():
        msg = (
            "Currently there is no [production server] available, so submission for test cannot be done. "
            "Register and activate your server at <a href='/engine/servers/'> "
            "[BlueKing - Developer Center - Server Info] </a>) "
        )
        logger.info(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"当前没有可用的[正式服务器], 无法进行提测操作. 请到<a href='/engine/servers/'> [蓝鲸智云-开发者中心-服务器信息] </a> 注册并激活服务器")
        result = {"result": False, "msg": msg}
        return render_json(result)

    # 前端变量不要一直向后, 限制
    is_tips = form_data.get("is_tips", 0)
    features = form_data.get("features", "")
    bugs = form_data.get("bugs", "")
    servers = form_data.get("servers", "").split(",")

    if app.state not in [AppStateEnum.OUTLINE, AppStateEnum.TEST]:
        msg = (
            "Current status of the app is:%s; you need to retest and deploy the APP before production deployment"
            % app.state_display
        )
        logger.info(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"应用当前状态：%s，APP需要重新测试部署后，才可以进行正式部署操作！") % app.state_display
        result = {"result": False, "msg": msg}
        return render_json(result)

    # 上线操作
    is_success, event_id, message = app_to_online_task(app_code, app, username, is_tips, features, bugs, servers)

    # 操作流水日志
    extra_data = {"username": username, "form_data": form_data}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.RELEASE_ONLINE, extra_data=extra_data
    )

    if is_success:
        msg = _(u"正式部署事件提交成功！")
        result = {"result": True, "msg": msg, "event_id": event_id}
    else:
        msg = message
        result = {"result": False, "msg": msg, "event_id": event_id}

    logger.info(u"[app:%s] %s event_id: %s" % (app_code, msg, event_id))
    return render_json(result)


@app_exists
@has_app_develop_permission
@require_POST
def release_outline(request, app_code):
    """
    app下架
    """
    logger.info(u"[app:%s] Start to remove the app..." % app_code)

    username = request.user.username
    try:
        form_data = json.loads(request.POST.get("form_data", "{}"))
    except Exception:
        msg = u"Parameters error!"
        logger.exception(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"参数错误！")
        result = {"result": False, "msg": msg}
        return render_json(result)

    # NOTE: 下架不加检查服务器, 因为此时已经提测/上线的, 所以默认可以下架成功

    mode = form_data.get("mode", "all")

    # 获取应用基本信息
    app = App.objects.get(code=app_code)

    # 状态判定
    is_ok = True
    if app.state not in [AppStateEnum.OUTLINE, AppStateEnum.TEST, AppStateEnum.ONLINE]:
        is_ok = False
        message = _(u"应用当前状态为：%s，不能进行下架操作！") % (app.state_display)
    elif mode in ["test", "all"] and not app.is_already_test:
        is_ok = False
        message = _(u"应用测试环境已经下架！")
    elif mode in ["prod", "all"] and not app.is_already_online:
        is_ok = False
        message = _(u"应用正式环境已经下架！")

    if not is_ok:
        logger.info(u"[app:%s] %s" % (app_code, message))
        return render_json({"result": is_ok, "msg": message})

    # 执行下架
    is_success, event_id = app_to_outline_task(app_code, app, username, mode)

    if is_success:
        msg = _(u"下架事件提交成功！")
        result = {"result": True, "msg": msg, "event_id": event_id}
    else:
        msg = _(u"下架事件提交失败！")
        result = {"result": False, "msg": msg, "event_id": event_id}

    # 操作流水日志
    extra_data = {"username": username, "form_data": form_data}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.RELEASE_OUTLINE, extra_data=extra_data
    )

    logger.info(u"[app:%s] %s event_id: %s" % (app_code, msg, event_id))
    return render_json(result)


@app_exists
@has_app_develop_permission
@require_POST
def release_delete(request, app_code):
    """
    删除应用
    """
    logger.info(u"[app:%s] Start to delete" % app_code)

    username = request.user.username

    app = App.objects.get(code=app_code)

    if app.state not in [1]:
        msg = u"The app has been deployed, so it cannot be deleted"
        logger.info(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"应用已经部署过，不能删除！")
        result = {"result": False, "msg": msg}
        return render_json(result)

    try:
        SecureInfo.objects.filter(app_code=app_code).delete()
        App.objects.filter(code=app_code).delete()
        # 将APP的发布记录保存为上一次，避免下次创建时显示冲突
        Record.objects.filter(app_code=app_code).update(version="last")
        # 删除 BkApp 资源
        BkApp.objects.filter(app_code=app_code).delete()
        msg = _(u"删除成功！")
        result = {"result": True, "msg": msg}
        logger.info(u"[app:%s] %s" % (app_code, msg))

        # audit log
        record_audit_log(
            system=AuditSystemEnum.PAAS,
            username=username,
            op_type=AuditEventOperationTypeEnum.DELETE,
            op_object_type=AuditOPObjectTypeEnum.APP,
            op_object_id=app.code,
            op_object_name=app.name,
        )

    except Exception:
        msg = u"Delete failed"
        logger.exception(u"[app:%s] %s" % (app_code, msg))
        msg = _(u"删除失败！")
        result = {"result": True, "msg": msg}
    # 操作流水日志
    extra_data = {"username": username}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.APP_DELETE, extra_data=extra_data
    )

    return render_json(result)


@app_exists
@has_app_develop_or_smart_develop_permission
def get_event_status(request, app_code):
    """
    查询事件状态
    app 提测、上线、下架后台任务状态轮询
    @return: result：0：失败，1：成功，2：正在执行
    """
    return raw_get_event_status(request, app_code)


@require_GET
@csrf_exempt
@login_exempt
@bk_paas_backend_required
def get_event_status_from_backend(request, app_code):
    return raw_get_event_status(request, app_code)


def raw_get_event_status(request, app_code):
    event_id = request.GET.get("event_id", "")
    ok, message, data = _get_event_status(event_id, app_code, request=request)
    result = {"result": ok, "message": message, "data": data}
    return render_json(result)


@app_exists
@has_app_develop_or_smart_develop_permission
def check_unfinished_task(request, app_code):
    """
    到app engine检查并更新最近10条未完成的task的状态
    """
    app = App.objects.get(code=app_code)
    records = (
        Record.objects.filter(app_code=app_code)
        .filter(operate_id__in=[OperateIDEnum.IN_TEST, OperateIDEnum.IN_ONLINE, OperateIDEnum.IN_OUTLINE])
        .order_by("-id")[:10]
    )

    for record in records:
        event_id = record.event_id
        event_ids = [event_id]
        if record.operate_id == OperateIDEnum.IN_OUTLINE:
            try:
                event_ids = json.loads(record.extra_data).get("event_ids", {})
            except Exception:
                event_ids = [event_id]

        is_http_ok, result = get_event_log(app_code=app_code, auth_token=app.auth_token, event_ids=event_ids)
        if is_http_ok:
            status = result.get("status")

            # 判定操作时间, 超过了, 就判定是超时, 直接失败
            expire_seconds = (timezone.now() - record.operate_time).total_seconds()
            if expire_seconds > settings.HISTORY_EVENT_STATE_EXPIRE_SECONDS and status != EventStatusEnum.SUCCESS:
                msg = (
                    u"check_unfinished_task, event timeout(%ss), set status to fail"
                    % settings.HISTORY_EVENT_STATE_EXPIRE_SECONDS
                )
                logger.info(u"[app:%s] %s, event_id:%s" % (app_code, msg, event_id))

                msg = _(u"check_unfinished_task, 事件超时(%ss), 设置为失败") % settings.HISTORY_EVENT_STATE_EXPIRE_SECONDS
                record.message = msg
                status = EventStatusEnum.FAILURE

            if status in (EventStatusEnum.SUCCESS, EventStatusEnum.FAILURE):
                record.is_success = status == EventStatusEnum.SUCCESS

                to_operate_id = {
                    OperateIDEnum.IN_TEST: OperateIDEnum.TO_TEST,
                    OperateIDEnum.IN_ONLINE: OperateIDEnum.TO_ONLINE,
                    OperateIDEnum.IN_OUTLINE: OperateIDEnum.TO_OUTLINE,
                }.get(record.operate_id, record.operate_id)
                record.operate_id = to_operate_id

                record.save()

    result = {"result": True}
    return render_json(result)


def get_last_release_record(request, app_code):
    """
    获取部署最新的一条记录，用于刷新页面后继续轮询部署状态
    """
    try:
        # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
        record = Record.objects.get_last_record(app_code)
        record_id = record.id
        result = {"res": True, "record_id": record_id, "event_id": record.event_id}
        return render_json(result)
    except Exception:
        msg = u"get_last_release_record query fail!"
        logger.exception(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"get_last_release_record 查询错误！")
        result = {"res": False, "msg": msg}
        return render_json(result)
