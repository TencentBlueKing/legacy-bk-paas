# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings

from common.http import http_delete, http_get, http_post, http_put
from common.log import logger
from release.constants import EventStatusEnum


def _gen_header(app_code, auth_token):
    headers = {
        "Content-Type": "application/json",
        "X-APP-CODE": app_code,
        "X-APP-TOKEN": auth_token,
    }
    return headers


def _call_appengine_api(http_func, url, data, headers=None, timeout=None,
                        caller='', max_retry_count=1):

    kwargs = dict(url=url, data=data, headers=headers, timeout=timeout)

    ok, data = http_func(**kwargs)
    # 重试
    retry_count = 0
    while (not ok) and retry_count < max_retry_count:
        logger.info("%s http request failed! retry %s", caller, (retry_count + 1))
        ok, data = http_func(**kwargs)
        retry_count += 1

    # process result
    if not ok:
        message = "调用appengine api失败: method={} info={}".format(
            http_func.func_name, kwargs
        )
        logger.error(message)
        return False, message, None

    result = data["result"]
    if not result:
        return False, data["message"], None

    return True, data["message"], data["data"]


def _process_status(status_list):
    """
    下架多操作的多个结果状态, 统一处理成一个状态
    """
    all_success = [status == EventStatusEnum.SUCCESS.value for status in status_list]
    if all(all_success):
        return EventStatusEnum.SUCCESS.value

    any_fail = [status == EventStatusEnum.FAILURE.value for status in status_list]
    if any(any_fail):
        return EventStatusEnum.FAILURE.value

    all_ready = [status == EventStatusEnum.READY.value for status in status_list]
    if all(all_ready):
        return EventStatusEnum.READY.value

    return EventStatusEnum.PENDING.value


def get_event_log(app_code, auth_token, event_ids):
    """
    获取 event log
    """
    result_list = []
    logs_list = []
    status_list = []

    for event_id in event_ids:
        url = "{host}/v1/apps/{app_code}/events/{event_id}/logs/".format(host=settings.ENGINE_HOST,
                                                                         app_code=app_code,
                                                                         event_id=event_id)
        headers = _gen_header(app_code, auth_token)
        ok, message, _data = _call_appengine_api(http_get, url, data={}, headers=headers, timeout=None,
                                                 caller='get_event_log', max_retry_count=0)

        if ok:
            logs_list.append(_data.get("logs", ''))
            status_list.append(_data.get("status", ''))

    if len(logs_list) == 2:
        logs_list[0] = "%s\n%s" % ("测试环境", logs_list[0])
        logs_list[1] = "%s\n%s" % ("正式环境", logs_list[1])

    is_success = all(result_list)
    logs = "\n==========\n".join(logs_list)
    status = _process_status(status_list)

    return is_success, dict(logs=logs, status=status)


def register_app(app_code, name, language, auth_token=''):
    """
    注册app
    注意, 这个接口不会校验 header

    - app_code: app编码
    - name: app名称
    - language: 语言
    """
    url = "{host}/v1/apps/".format(host=settings.ENGINE_HOST)
    data = dict(app_code=app_code, name=name, app_lang=language)
    headers = _gen_header(app_code, auth_token)

    ok, message, _data = _call_appengine_api(http_post, url, data=data, headers=headers, timeout=None,
                                             caller='register_app', max_retry_count=5)

    if not ok:
        message = "应用[{}]注册失败 [url={}, resp_data={}, message={}]. 可能原因:App Engine 未正常启动".format(
            app_code, url, _data, message
        )
        logger.error(message)
        return False, message, None
    return True, 'success', _data["token"]


def release_app(app_code, mode, auth_token, data):
    """
    提测、上线操作调用托管接口
    @param app_code: app编码
    @param auth_token: 鉴权token
    @param envs: 提交给app engine的参数
    @param mode: 环境选择 test/prod
    """
    url = "{host}/v1/apps/{app_code}/{mode}/releases/".format(host=settings.ENGINE_HOST,
                                                              mode=mode,
                                                              app_code=app_code)

    headers = _gen_header(app_code, auth_token)

    ok, message, _data = _call_appengine_api(http_post, url, data=data, headers=headers, timeout=None,
                                             caller='release_app', max_retry_count=5)
    if not ok:
        logger.error(message)
        return False, (None, 0, '')

    event_info = (_data.get("event_id"), _data.get("error_code", 0), message)
    return True, event_info


def _do_unrelease(app_code, auth_token, mode):
    """
    下线
    """
    url = "{host}/v1/apps/{app_code}/{mode}/releases/".format(host=settings.ENGINE_HOST,
                                                              mode=mode,
                                                              app_code=app_code)
    data = dict(envs={}, mode=mode)
    headers = _gen_header(app_code, auth_token)

    ok, message, _data = _call_appengine_api(http_delete, url, data=data, headers=headers, timeout=None,
                                             caller='_do_unrelease', max_retry_count=5)
    if not ok:
        logger.error("应用[%s]下架失败 [url=%s, resp_data=%s, message=%s]. 可能原因:App Engine 未正常启动",
                     app_code, url, _data, message)

    return ok, _data


def unrelease_app(app_code, auth_token, mode):
    """
    下架操作接口, 支持多个event_id

    @param app_code: app编码
    @param auth_token: app 授权token
    @param mode: all/test/prod
    """
    # 单个环境
    if mode != "all":
        ok, data = _do_unrelease(app_code, auth_token, mode)
        if not ok:
            return False, None

        event_id = data.get("event_id")
        return True, [event_id]

    # 多个环境
    ok_1, data_1 = _do_unrelease(app_code, auth_token, "test")
    ok_2, data_2 = _do_unrelease(app_code, auth_token, "prod")

    all_ok = ok_1 and ok_2
    if not all_ok:
        return False, None

    event_id1 = data_1.get("event_id")
    event_id2 = data_2.get("event_id")
    return True, [event_id1, event_id2]


def activate_agent(server_id):
    """激活服务器
    """
    url = "{host}/v1/agents/{server_id}/".format(host=settings.ENGINE_HOST,
                                                 server_id=server_id)

    headers = {
        "Content-Type": "application/json",
    }

    ok, message, _ = _call_appengine_api(http_put, url, data={}, headers=headers, timeout=10,
                                         caller='get_agent_healthz', max_retry_count=1)

    return ok, message


def activate_service(category, server_id):
    """激活服务
    """
    url = ("{host}/v1/services/{service_name}/"
           "servers/{server_id}/").format(host=settings.ENGINE_HOST,
                                          service_name=category,
                                          server_id=server_id)
    headers = {
        "Content-Type": "application/json",
    }
    ok, message, _ = _call_appengine_api(http_put, url, data={}, headers=headers, timeout=10,
                                         caller='check_services_status', max_retry_count=1)

    return ok, message
