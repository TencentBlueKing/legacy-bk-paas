# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import datetime
import json

from django.conf import settings

from app.constants import AppStateEnum
from app.models import App
from common.constants import ModeEnum
from common.log import logger
from common.mymako import render_mako_tostring_context
from components.engine import get_event_log
from release.constants import EventResultEnum, EventStatusEnum, OperateIDEnum, APP_ONGOING_OPERATE_ID_LIST
from release.models import Record, UserOperateRecord
from saas.models import SaaSApp


def record_user_operate(app_code, username, operate_type, before_data='', arfter_data='', extra_data=''):
    """
    用户操作记录创建
    @param app_code: app编码
    @param username: 操作人
    @param operate_type: 操作类型
    @param before_data: 操作前数据
    @param arfter_data: 操作后数据
    @param extra_data: 其他数据
    """
    if isinstance(extra_data, dict):
        extra_data = json.dumps(extra_data)

    if not isinstance(extra_data, basestring):
        extra_data = str(extra_data)

    result = UserOperateRecord.objects.create_operate_record(app_code, username, operate_type,
                                                             before_data, arfter_data, extra_data)
    return result


def record_user_release_operate(app_code, username, operate_type, extra_data):
    return record_user_operate(app_code, username, operate_type,
                               before_data='', arfter_data='', extra_data=extra_data)


def _update_status_test(is_success, app, app_old_state, record):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_TEST.value
    record.save()

    if not is_success:
        App.objects.to_state(app_code, app_old_state)
        return

    data = dict(is_already_test=True)
    # 记录首次提测时间
    if not app.first_test_time:
        data.update({
            "first_test_time": datetime.datetime.now()
        })
    App.objects.to_state(app_code, AppStateEnum.TEST.value, **data)


def _update_status_online(is_success, app, app_old_state, record):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_ONLINE.value
    record.save()

    if not is_success:
        App.objects.to_state(app_code, app_old_state)
        return

    data = dict(is_already_online=True)
    # 记录首次提测时间
    if not app.first_online_time:
        data.update({
            "first_online_time": datetime.datetime.now()
        })
    App.objects.to_state(app_code, AppStateEnum.ONLINE.value, **data)


def _update_status_offline(is_success, app, app_old_state, record, mode):
    app_code = app.code
    record.operate_id = OperateIDEnum.TO_OFFLINE.value
    record.save()

    # 下架成功后修改app状态为下架
    if not is_success:
        App.objects.to_state(app_code, app_old_state)
        return

    if mode == ModeEnum.ALL.value:
        App.objects.to_state(app_code, AppStateEnum.OFFLINE.value,
                             is_already_online=False, is_already_test=False)

    # t环境下架
    elif mode == ModeEnum.TEST.value:
        is_already_online = App.objects.get(code=app_code).is_already_online
        # 正式环境已上线，保持之前原有状态
        if is_already_online:
            App.objects.to_state(app_code, app_old_state, is_already_test=False)
        else:
            # 正式环境未上线或已下架，则状态为下架
            App.objects.to_state(app_code, AppStateEnum.OFFLINE.value, is_already_test=False)
    # o环境下架，做标识
    elif mode == ModeEnum.PROD.value:
        # 应用是否在线 = !下架成功
        App.objects.to_state(app_code, AppStateEnum.OFFLINE.value, is_already_online=False)


def _get_event_ids_and_mode(record, event_id):
    event_ids = [event_id]
    mode = ModeEnum.ALL.value
    try:
        extra_data = json.loads(record.extra_data)
        if record.operate_id == OperateIDEnum.IN_OFFLINE.value:
            event_ids = extra_data.get("event_ids", {})
        else:
            if extra_data.get("event_id"):
                event_ids = [extra_data.get("event_id")]

        mode = extra_data.get("mode", ModeEnum.ALL.value)
    except Exception:
        event_ids = [event_id]
        mode = ModeEnum.ALL.value

    return event_ids, mode


def get_event_status(event_id, app_code, expire_seconds=settings.EVENT_STATE_EXPIRE_SECONDS, request=None):
    """
    查询事件状态
    app 提测、上线、下架后台任务状态轮询
    @return: result：0：失败，1：成功，2：正在执行
    """
    record = Record.objects.filter(event_id=event_id).first()
    if not (event_id and record):
        message = "查询事件状态失败"
        logger.warning("[app:%s] %s, event_id:%s", app_code, message, event_id)
        data = {
            "status": EventResultEnum.PENDING.value,
            "html": message,
        }
        return False, message, data

    app = App.objects.get(code=app_code)

    app_old_state = record.app_old_state
    event_ids, mode = _get_event_ids_and_mode(record, event_id)

    ok, data = get_event_log(app_code=app_code, auth_token=app.auth_token, event_ids=event_ids)
    logger.info("get_event_status: [event_id=%s, ok=%s, data=%s]", event_ids, ok, data)

    event_log = ''
    status = EventStatusEnum.PENDING.value
    is_success = False
    # 查询完成, 判定状态, 更新app
    if ok:
        event_log = data.get("logs")
        status = data.get("status")

        # 判定, 是否超时了, 且status != 'SUCCESS'
        total_seconds = (datetime.datetime.now() - record.operate_time).total_seconds()
        if total_seconds > expire_seconds and status != EventStatusEnum.SUCCESS.value:
            message = "事件超时({}s), 设置为失败".format(settings.EVENT_STATE_EXPIRE_SECONDS)
            logger.info("[app:%s] %s, event_id:%s", app_code, message, event_id)
            record.message = message
            status = EventStatusEnum.FAILURE.value

        # 轮询时, 顺带更新record的状态为结束
        is_success = (status == EventStatusEnum.SUCCESS.value)
        if status in (EventStatusEnum.SUCCESS.value, EventStatusEnum.FAILURE.value):
            # 是否操作成功了
            record.is_success = is_success
            record.message = "操作{}! \n{}".format("成功" if is_success else "失败", event_log)

            if record.operate_id == OperateIDEnum.IN_TEST.value or app.state == AppStateEnum.IN_TEST.value:
                _update_status_test(is_success, app, app_old_state, record)

            elif record.operate_id == OperateIDEnum.IN_ONLINE.value or app.state == AppStateEnum.IN_ONLINE.value:
                _update_status_online(is_success, app, app_old_state, record)

            elif record.operate_id == OperateIDEnum.IN_OFFLINE.value or app.state == AppStateEnum.IN_OFFLINE.value:
                _update_status_offline(is_success, app, app_old_state, record, mode)

            # 如果是SaaS应用, 成功后更新online_version=current_version
            logger.info("judge if to update_online_version: is_saas=%s, is_success=%s", app.is_saas, is_success)
            if app.is_saas and is_success:
                SaaSApp.objects.update_online_version(app_code)

    # gen html
    if request:
        html_context = {"app_code": app_code,
                        "operate_id": record.operate_id,
                        "event_id": event_id,
                        "event_log": event_log,
                        "status": status,
                        "is_success": is_success,
                        "is_saas": app.is_saas,
                        }
        html_data = render_mako_tostring_context(request, "release/release_flow.part", html_context)
    else:
        html_data = event_log

    # 操作成功后, 就应该停止
    # 正在上线或者提测, 轮询不能停
    if record.operate_id in APP_ONGOING_OPERATE_ID_LIST:
        status = EventResultEnum.PENDING.value
    elif status == 'FAILURE':
        status = EventResultEnum.FAIL.value
    else:
        status = EventResultEnum.SUCCESS.value

    data = {
        "status": status,
        "html": html_data,
        "app_test_url": app.app_test_url,
        "app_prod_url": app.app_prod_url,
    }
    return True, 'success', data


def sync_app_state(app_code):
    """
    更新应用的状态

    如果应用的状态是：正在提测、上线、下架 则调用appengine 接口刷新应用的状态
    """
    # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
    record = Record.objects.get_app_newest_record(app_code)
    # 没有发布记录则直接返回None，不刷新应用状态
    if not record:
        return None

    event_id = record.event_id
    # 更新应用最新状态
    get_event_status(event_id, app_code)


def get_release_home_page_data(app_code, username, page=''):
    """
    获取部署/下架首页数据
    """
    app = App.objects.get(code=app_code)
    is_app_creater = (app.creater == username)

    # 获取最后一条操作记录
    lastest_record = Record.objects.get_latest_did_record(app_code)
    data = {"app_code": app_code,
            "app": app,
            "is_app_creater": is_app_creater,
            "lastest_record": lastest_record,
            "app_test_url": app.app_test_url,
            "app_prod_url": app.app_prod_url,
            }

    if page:
        data.update({"page": page})
    return data
