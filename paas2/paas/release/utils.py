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
from django.utils.translation import ugettext as _
from django.conf import settings

from common.log import logger
from common.mymako import render_mako_tostring_context
from app.models import App
from app.constants import AppStateEnum
from engine.api import get_event_log
from release.models import Record
from release.constants import OperateIDEnum, EventStatusEnum, EventResultEnum
from saas.utils import update_online_version


def get_release_home_page_data(app_code, username, page=""):
    """
    获取部署/下架首页数据
    """
    app = App.objects.get(code=app_code)
    # is_app_creater = (app.creater == request.user.username)
    is_app_creater = app.creater == username

    # 获取最后一条操作记录
    lastest_record = None
    record = (
        Record.objects.filter(
            operate_id__in=[OperateIDEnum.TO_TEST, OperateIDEnum.TO_ONLINE, OperateIDEnum.TO_OUTLINE],
            app_code=app_code,
        )
        .order_by("-id")
        .first()
    )
    if record:
        lastest_record = {
            "username": record.operate_user,
            "datetime": record.operate_time_display,
            # "operate_type": record.get_operate_id_display(),
            "operate_type": record.operate_type_display,
            "result": _(u"成功") if record.is_success else _(u"失败"),
        }

    data = {
        "app_code": app_code,
        "app": app,
        "is_app_creater": is_app_creater,
        "lastest_record": lastest_record,
        "app_test_url": app.app_test_url,
        "app_prod_url": app.app_prod_url,
    }

    if page:
        data.update({"page": page})
    return data


def _update_status_test(is_success, app, app_old_state, record, mode):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_TEST
    record.save()

    if not is_success:
        App.objects.filter(code=app_code).update(state=app_old_state)
    else:
        App.objects.filter(code=app_code).update(state=AppStateEnum.TEST, is_already_test=True)
        # 记录首次提测时间
        if not app.first_test_time:
            App.objects.filter(code=app_code).update(first_test_time=timezone.now())

        # 如果是SaaS应用, 成功后更新online_version=current_version
        logger.info("update_online_version: is_saas=%s, is_success=%s" % (app.is_saas, is_success))
        if app.is_saas and is_success:
            update_online_version(app_code, mode)


def _update_status_online(is_success, app, app_old_state, record, mode):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_ONLINE
    record.save()

    if not is_success:
        App.objects.filter(code=app_code).update(state=app_old_state)
    else:
        App.objects.filter(code=app_code).update(state=AppStateEnum.ONLINE, is_already_online=True)
        if not app.first_online_time:
            App.objects.filter(code=app_code).update(first_online_time=timezone.now())

        # 如果是SaaS应用, 成功后更新online_version=current_version
        logger.info("update_online_version: is_saas=%s, is_success=%s" % (app.is_saas, is_success))
        if app.is_saas and is_success:
            update_online_version(app_code, mode)


def _update_status_outline(is_success, app, app_old_state, record, mode):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_OUTLINE
    record.save()

    # 下架成功后修改app状态为下架
    if not is_success:
        App.objects.filter(code=app_code).update(state=app_old_state)
    else:
        if mode == "all":
            App.objects.filter(code=app_code).update(
                state=AppStateEnum.OUTLINE, is_already_online=False, is_already_test=False
            )
        # t环境下架
        elif mode == "test":
            is_already_online_old = App.objects.get(code=app_code).is_already_online
            # 正式环境已上线，保持之前原有状态
            if is_already_online_old:
                App.objects.filter(code=app_code).update(state=app_old_state, is_already_test=False)
            else:
                # 正式环境未上线或已下架，则状态为下架
                App.objects.filter(code=app_code).update(state=AppStateEnum.OUTLINE, is_already_test=False)
        # o环境下架，做标识
        elif mode == "prod":
            # 应用是否在线 = !下架成功
            App.objects.filter(code=app_code).update(state=AppStateEnum.OUTLINE, is_already_online=False)


def _get_event_ids_and_mode(record, event_id):
    event_ids = [event_id]
    mode = "all"
    try:
        extra_data = json.loads(record.extra_data)
        if record.operate_id == OperateIDEnum.IN_OUTLINE:
            event_ids = extra_data.get("event_ids", {})
        else:
            if extra_data.get("event_id"):
                event_ids = [extra_data.get("event_id")]

        mode = extra_data.get("mode", "all")
    except Exception:
        event_ids = [event_id]
        mode = "all"

    return event_ids, mode


def _get_event_status(event_id, app_code, expire_seconds=settings.EVENT_STATE_EXPIRE_SECONDS, request=None):
    """
    查询事件状态
    app 提测、上线、下架后台任务状态轮询
    @return: result：0：失败，1：成功，2：正在执行
    """
    record = Record.objects.filter(event_id=event_id).first()
    if not (event_id and record):
        # return {"result": 2, "msg": msg, "data": msg}
        message = "query event status fail"
        logger.warning(u"[app:%s] %s, event_id:%s", app_code, message, event_id)
        message = _(u"查询事件状态失败")
        data = {
            "status": EventResultEnum.PENDING,
            "html": message,
        }
        return False, message, data

    app_old_state = record.app_old_state
    event_ids, mode = _get_event_ids_and_mode(record, event_id)

    app = App.objects.get(code=app_code)
    # 调用app engine 接口查询
    is_http_ok, result = get_event_log(app_code=app_code, auth_token=app.auth_token, event_ids=event_ids)
    logger.info("_get_event_status: [event_id=%s, is_http_ok=%s, result=%s]" % (event_ids, is_http_ok, result))

    event_log = ""
    status = EventStatusEnum.PENDING
    is_success = False
    # 查询完成, 判定状态, 更新app
    if is_http_ok:
        event_log = result.get("logs")
        status = result.get("status")

        # 判定, 是否超时了, 且status != 'SUCCESS'
        total_seconds = (timezone.now() - record.operate_time).total_seconds()
        if total_seconds > expire_seconds and status != EventStatusEnum.SUCCESS:
            msg = u"event timeout(%ss), set status to fail" % settings.EVENT_STATE_EXPIRE_SECONDS
            logger.info(u"[app:%s] %s, event_id:%s" % (app_code, msg, event_id))

            msg = _(u"事件超时(%ss), 设置为失败") % settings.EVENT_STATE_EXPIRE_SECONDS
            record.message = msg
            status = EventStatusEnum.FAILURE

        # 轮询时, 顺带更新record的状态为结束
        is_success = status == EventStatusEnum.SUCCESS
        if status in (EventStatusEnum.SUCCESS, EventStatusEnum.FAILURE):
            # 是否操作成功了
            record.is_success = is_success
            record.message = _(u"操作%s! \n%s") % (_(u"成功") if is_success else _(u"失败"), event_log)
            if record.operate_id == OperateIDEnum.IN_TEST or app.state == AppStateEnum.IN_TEST:
                _update_status_test(is_success, app, app_old_state, record, mode)
            elif record.operate_id == OperateIDEnum.IN_ONLINE or app.state == AppStateEnum.IN_ONLINE:
                _update_status_online(is_success, app, app_old_state, record, mode)
            elif record.operate_id == OperateIDEnum.IN_OUTLINE or app.state == AppStateEnum.IN_OUTLINE:
                _update_status_outline(is_success, app, app_old_state, record, mode)

    if request:
        html_context = {
            "app_code": app_code,
            "operate_id": record.operate_id,
            "event_id": event_id,
            "event_log": event_log,
            "status": status,
            "is_success": is_success,
            "is_saas": app.is_saas,
            "mode": mode,
        }
        html_data = render_mako_tostring_context(request, "release/release_flow.part", html_context)
    else:
        html_data = event_log

    # 操作成功后, 就应该停止
    # 正在上线或者提测, 轮询不能停
    if record.operate_id in (OperateIDEnum.IN_TEST, OperateIDEnum.IN_ONLINE, OperateIDEnum.IN_OUTLINE):
        status = EventResultEnum.PENDING
    elif status == "FAILURE":
        status = EventResultEnum.FAIL
    else:
        status = EventResultEnum.SUCCESS

    data = {
        "status": status,
        "html": html_data,
        "app_test_url": app.app_test_url,
        "app_prod_url": app.app_prod_url,
    }
    # return result
    return True, "success", data


def update_app_state(app_code):
    """
    更新应用的状态

    如果应用的状态是：正在提测、上线、下架 则调用appengine 接口刷新应用的状态
    """
    # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
    records = Record.objects.filter(app_code=app_code).filter(
        operate_id__in=[
            OperateIDEnum.TO_TEST,
            OperateIDEnum.TO_ONLINE,
            OperateIDEnum.TO_OUTLINE,
            OperateIDEnum.IN_TEST,
            OperateIDEnum.IN_ONLINE,
            OperateIDEnum.IN_OUTLINE,
        ]
    )
    # 没有发布记录则直接返回None，不刷新应用状态
    if not records:
        return None

    record = records.latest("id")
    event_id = record.event_id
    # 更新应用最新状态
    _get_event_status(event_id, app_code)
