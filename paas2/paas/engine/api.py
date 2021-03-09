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

from django.conf import settings
from django.utils.translation import ugettext as _

from common.log import logger
from release.constants import EventStatusEnum
from common.http import (
    engine_http_get as http_get,
    engine_http_post as http_post,
    engine_http_delete as http_delete,
    _http_request,
)


def get_app_info(app_code, auth_token):
    """
    获取app engine上app基本信息
    """
    url = settings.ENGINE_APP_INFO_URL.format(app_code=app_code)
    data = {}
    is_success, result = http_get(app_code=app_code, auth_token=auth_token, url=url, params=data)
    return is_success, result


def _process_status(status_list):
    """
    下架多操作的多个结果状态, 统一处理成一个状态
    """
    all_success = [status == EventStatusEnum.SUCCESS for status in status_list]
    if all(all_success):
        return EventStatusEnum.SUCCESS

    any_fail = [status == EventStatusEnum.FAILURE for status in status_list]
    if any(any_fail):
        return EventStatusEnum.FAILURE

    all_ready = [status == EventStatusEnum.READY for status in status_list]
    if all(all_ready):
        return EventStatusEnum.READY

    return EventStatusEnum.PENDING


def get_event_log(app_code, auth_token, event_ids):
    """
    获取 event log
    """
    is_success_list = []
    logs_list = []
    status_list = []

    for event_id in event_ids:
        url = settings.ENGINE_APP_EVENT_LOGS_URL.format(app_code=app_code, event_id=event_id)
        data = {}
        is_http_ok, result = http_get(app_code=app_code, auth_token=auth_token, url=url, params=data)

        is_success_list.append(is_http_ok)
        if is_http_ok:
            logs_list.append(result.get("logs", ""))
            status_list.append(result.get("status", ""))

    if len(logs_list) == 2:
        logs_list[0] = u"%s\n%s" % (_(u"测试环境"), logs_list[0])
        logs_list[1] = u"%s\n%s" % (_(u"正式环境"), logs_list[1])

    is_success = all(is_success_list)
    logs = "\n==========\n".join(logs_list)
    status = _process_status(status_list)

    return is_success, dict(logs=logs, status=status)


def register_app(app_code, name, language, auth_token=""):
    """
    注册app
    注意, 这个接口不会校验 header

    @param app_code: app编码
    @param name: app名称
    @param language: 语言
    """
    url = settings.ENGINE_APP_INIT_URL
    data = dict(app_code=app_code, name=name, app_lang=language)

    is_success, result = http_post(app_code, auth_token, url, data)
    # 重试5次
    retry_count = 0
    while (not is_success) and retry_count < 5:
        logger.info("[app:%s] register_app http post failed! retry %s" % (app_code, retry_count + 1))
        is_success, result = http_post(app_code, auth_token, url, data)
        retry_count += 1

    return is_success, result


def release_app(app_code, auth_token, data):
    """
    提测、上线操作调用托管接口
    @param app_code: app编码
    @param auth_token: 鉴权token
    @param envs: 提交给app engine的参数
    @param mode: 环境选择 test/prod
    """
    url = settings.ENGINE_APP_RELEASE_URL.format(app_code=app_code)

    is_success, result = http_post(app_code, auth_token, url, data)
    # 重试5次
    retry_count = 0
    while (not is_success) and retry_count < 5:
        logger.info("[app:%s] release_app http post failed! retry %s" % (app_code, retry_count + 1))
        is_success, result = http_post(app_code, auth_token, url, data)
        retry_count += 1

    #  event_id = result.get("event_id") if result else None
    return is_success, result


def _do_unrelease(app_code, auth_token, mode):
    """
    下线
    """
    url = settings.ENGINE_APP_RELEASE_URL.format(app_code=app_code)
    envs = {}
    data = dict(envs=envs, mode=mode)

    is_success, result = http_delete(app_code, auth_token, url, data)
    retry_count = 0
    while (not is_success) and retry_count < 5:
        logger.info("[app:%s] do_unrelease http post failed! retry %s" % (app_code, retry_count + 1))
        is_success, result = http_delete(app_code, auth_token, url, data)
        retry_count += 1

    return is_success, result


def unrelease_app(app_code, auth_token, mode):
    """
    下架操作接口, 支持多个event_id

    @param app_code: app编码
    @param auth_token: app 授权token
    @param mode: all/test/prod
    """
    # 单个环境
    if mode != "all":
        is_success, result = _do_unrelease(app_code, auth_token, mode)
        if not is_success:
            return False, None

        event_id = result.get("event_id")
        return True, [event_id]

    # 多个环境
    is_success_1, result_1 = _do_unrelease(app_code, auth_token, "test")
    is_success_2, result_2 = _do_unrelease(app_code, auth_token, "prod")

    is_success = is_success_1 and is_success_2
    if not is_success:
        return False, None
    event_id1 = result_1.get("event_id")
    event_id2 = result_2.get("event_id")
    return True, [event_id1, event_id2]


def get_agent_healthz(server_id):
    """
    查询 anget 状态信息
    """
    url = settings.ENGINE_AGENT_HEALTHZ_URL
    headers = {
        "Content-Type": "application/json",
    }
    data = {"server_id": server_id}
    is_success, result = _http_request(method="GET", url=url, headers=headers, data=data, timeout=10)
    # 重试1次
    retry_count = 0
    while (not is_success) and retry_count < 1:
        logger.info("get_agent_healthz http request failed! retry %s" % (retry_count + 1))
        is_success, result = _http_request(method="GET", url=url, headers=headers, data=data, timeout=10)
        retry_count += 1

    agents = {}
    if result:
        if isinstance(result, dict):
            agents = result.get("agents", {})
        else:
            # 请求返回数据格式错误.返回数据:%s
            logger.error(u"get_agent_healthz response data format is invalid. data:%s" % result)
    return is_success, agents


def check_services_status(category, server_id):
    """
    查询服务状态
    v1/services/rabbitmq/check/  成功{“code”: 0, "msg": ""}, 错误{"code": 1, "msg": ""}
    """
    url = settings.ENGINE_SERVICE_STATUS_URL.format(category=category, server_id=server_id)
    headers = {
        "Content-Type": "application/json",
    }
    is_success, result = _http_request(method="GET", url=url, headers=headers, data={}, timeout=10)
    # 重试1次
    retry_count = 0
    while (not is_success) and retry_count < 1:
        logger.info("check_services_status http request failed! retry %s" % (retry_count + 1))
        is_success, result = _http_request(method="GET", url=url, headers=headers, data={}, timeout=10)
        retry_count += 1
    return is_success, result


def delete_server(server_id):
    url = "{host}/v1/apps/servers/{server_id}/".format(host=settings.ENGINE_HOST, server_id=server_id)
    is_success, result = _http_request(method="DELETE", url=url, data={}, timeout=10)
    if not is_success:
        logger.error("delete server from engine fail: url=%s", url)

    return is_success, result
