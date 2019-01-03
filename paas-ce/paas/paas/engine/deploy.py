# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

app engine 部署相关

# NOTE: 异常统一在这一层处理
""" # noqa

from __future__ import unicode_literals

import json

from django.conf import settings

from app.constants import AppStateEnum
from app.models import App, SecureInfo
from app_env.models import AppEnvVar
from common.log import logger
from components.engine import release_app, unrelease_app
from engine.models import ThirdServer
from release.constants import DEPLOY_ERROR_DICT, OperateIDEnum, StatusEnum
from release.models import Record, Version


def _get_app_env(app_code, is_with_db_info=False):
    """
    envs

    NOTE: 注意, envs类型默认都是字符串
    """
    app = App.objects.get(code=app_code)
    if not SecureInfo.objects.exists(app_code):
        return {}

    # add host to env
    bk_paas_host = "%s://%s" % (settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)
    cc_host = "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_CC)
    job_host = '%s://%s' % (settings.HTTP_SCHEMA, settings.HOST_JOB)
    bk_paas_inner_host = "http://%s" % settings.PAAS_INNER_DOMAIN

    envs = {"APP_ID": app_code,
            "APP_TOKEN": app.auth_token,
            "BK_PAAS_HOST": bk_paas_host,
            "BK_PAAS_INNER_HOST": bk_paas_inner_host,
            "BK_CC_HOST": cc_host,
            "BK_JOB_HOST": job_host,
            }

    if is_with_db_info:
        db_info = SecureInfo.objects.get_db_info(app_code)
        envs.update(db_info)

    # 值转成字符串
    for key, value in envs.iteritems():
        envs[key] = str(value)

    return envs


def _make_record(app_code, app_old_state, operate_user, operate_id, is_success):
    record = Record.objects.create_record(app_code=app_code,
                                          app_old_state=app_old_state,
                                          operate_user=operate_user,
                                          operate_id=operate_id,
                                          is_success=is_success)
    return record


def _save_record(record, event_id=None, operate_id=None, message=None, is_tips=None, is_success=None, extra_data=None):
    if event_id is not None:
        record.event_id = event_id

    if extra_data is not None:
        record.extra_data = json.dumps(extra_data)

    if operate_id is not None:
        record.operate_id = operate_id
    if message is not None:
        record.message = message

    if is_tips is not None:
        record.is_tips = is_tips
    if is_success is not None:
        record.is_success = is_success

    record.save()


def _build_relase_data(app, mode, is_saas=None, saas_settings=None):
    """
    构造release_app中data字段的数据结构
    """

    app_code = app.code
    deploy_token = app.deploy_token

    # deploy_vars
    deploy_vars = {}
    # 目前只有 vcs 版本管理信息
    deploy_vars.update(SecureInfo.objects.get_vcs_info(app_code))

    # envs
    is_with_db_info = is_saas
    envs = _get_app_env(app_code, is_with_db_info=is_with_db_info)

    # get env vars from AppEnvVar
    envs.update(AppEnvVar.objects.get_env_vars(app_code=app_code, mode=mode))

    triggers = dict(is_use_celery=app.is_use_celery, is_use_celery_beat=app.is_use_celery_beat)
    services = ThirdServer.objects.get_external_services()

    data = dict(envs=envs, triggers=triggers, services=services, mode=mode,
                deploy_token=deploy_token, deploy_vars=deploy_vars)

    if is_saas is not None:
        data["is_saas"] = is_saas
    if saas_settings is not None:
        data["saas_settings"] = saas_settings

    return data


# =============================================== start outer api for paas =============================================

def _call_release_app(app_code, app, app_old_state, to_state,
                      operate_user, in_operate_id, to_operate_id, mode,
                      is_tips=None, features=None, bugs=None,
                      is_saas=None, saas_settings=None):
    """
    call release app

    only for mode=prod / saas => is_tips=None, features=None, bugs=None,
    only for saas => is_saas=None, saas_settings=None
    """

    env_str = "测试" if mode == 'test' else "正式"
    if is_saas:
        env_str = "SaaS 应用上线"
    auth_token = app.auth_token

    try:
        # 新建一条记录
        record = _make_record(app_code, app_old_state, operate_user, in_operate_id, StatusEnum.FAIL.value)

        # 修改状态为
        App.objects.to_state(app_code, to_state)

        # 开始提测流程
        data = _build_relase_data(app, mode=mode, is_saas=is_saas, saas_settings=saas_settings)
        ok, event_info = release_app(app_code=app_code, mode=mode, auth_token=auth_token, data=data)

        # 对release_app的参数拆包
        event_id, error_code, error_msg = event_info

        if not ok:
            if error_code:
                error_msg = DEPLOY_ERROR_DICT.get(str(error_code))
            else:
                error_msg = ("{}部署事件提交失败！请确认 1.appengine服务正常 2.安装并注册了对应的agent服务器"
                             " 3.第三方服务等正常 [{}]").format(env_str, error_msg)

            message = ("[app:{}] {}部署事件提交失败, "
                       "error_code: {}, error_msg: {}").format(app_code, env_str, error_code, error_msg)
            logger.info(message)
            App.objects.to_state(app_code, app_old_state)

            # 失败则实时更新状态
            _save_record(record=record, operate_id=to_operate_id, message=message, is_success=False)

            return False, None, "{}部署事件提交失败, {}".format(env_str, error_msg)

        message = "[app:{}] {}部署事件提交成功".format(app_code, env_str)
        logger.info(message)

        if mode == 'test':
            # 提测成功后  修改状态 为测试中
            # App的状态变更迁移到查询端处理

            # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_TEST, is_success => is_success
            _save_record(record, event_id=event_id, message=message,
                         extra_data={"task_detail": '', "event_id": event_id})
        else:
            Version.objects.create_version(app, bugs, features, operate_user)

            # NOTE: App的状态变更迁移到查询端处理

            # 记录测试环境上线操作（成功和失败均记录）
            extra_data = record.get_extra_data()
            try:
                extra_data["task_detail"] = ''
                extra_data["event_id"] = event_id
            except Exception:
                extra_data = {"task_detail": '', "event_id": event_id}
            # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_ONLINE, is_success => is_success
            _save_record(record, event_id=event_id, message=message,
                         is_tips=int(is_tips), extra_data=extra_data)

        return True, event_id, None
    except Exception as e:
        message = "[app:{}] {}部署事件提交失败，error：{}".format(app_code, env_str, e)
        logger.exception(message)

        App.objects.to_state(app_code, app_old_state)

        _save_record(record, operate_id=to_operate_id, message=message, is_success=False)

        return False, None, message


def app_to_test_task(app_code, app, username):
    """
    提测后台任务
    """
    app_old_state = app.state
    # 修改状态为 正在提测（状态8） -> do -> success  / fail
    ok, event_id, message = _call_release_app(app_code=app_code,
                                              app=app,
                                              app_old_state=app_old_state,
                                              to_state=AppStateEnum.IN_TEST.value,
                                              operate_user=username,
                                              in_operate_id=OperateIDEnum.IN_TEST.value,
                                              to_operate_id=OperateIDEnum.TO_TEST.value,
                                              mode='test',
                                              )

    return ok, event_id, message


def app_to_online_task(app_code, app, username, is_tips, features, bugs):
    """
    上线操作后台任务
    """
    app_old_state = app.state
    ok, event_id, message = _call_release_app(app_code=app_code,
                                              app=app,
                                              app_old_state=app_old_state,
                                              to_state=AppStateEnum.IN_ONLINE.value,
                                              operate_user=username,
                                              in_operate_id=OperateIDEnum.IN_ONLINE.value,
                                              to_operate_id=OperateIDEnum.TO_ONLINE.value,
                                              mode='prod',
                                              is_tips=is_tips, features=features, bugs=bugs,
                                              )
    return ok, event_id, message


def app_to_offline_task(app_code, auth_token, username, mode, app_old_state):
    """
    下架操作后台任务
    """
    try:
        record = _make_record(app_code, app_old_state, username, OperateIDEnum.IN_OFFLINE.value, StatusEnum.FAIL.value)

        # 修改app的状态为正在下架（状态10）
        App.objects.to_state(app_code, AppStateEnum.IN_OFFLINE.value)

        # NOTE: 可能存在多个event_id
        ok, event_ids = unrelease_app(app_code, auth_token, mode)
        if not ok:
            message = "[app:{}] {}".format(app_code, "下架事件提交失败")
            logger.info(message)
            # 失败, 改为原来的状态
            App.objects.to_state(app_code, app_old_state)

            _save_record(record=record, operate_id=OperateIDEnum.TO_OFFLINE.value, message=message, is_success=False)

            return False, None

        message = "[app:{}] {}".format(app_code, "下架事件提交成功")
        logger.info(message)
        # 下架成功后修改app状态为下架
        # App的状态变更迁移到查询端处理

        # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_OFFLINE, is_success => is_success
        # 更新操作记录, 记录第一个event_id, 实际两个都放在 extra_data里面, mode和app_old_state在后面要用到

        extra_data = {"mode": mode, "task_detail": '', "event_ids": event_ids}
        _save_record(record, event_id=event_ids[0], message=message, extra_data=extra_data)

        return True, event_ids[0]
    except Exception as e:
        logger.info("[app:%s] %s", app_code, "下架事件提交失败")
        message = "[app:{}] 下架任务失败 error：{}".format(app_code, e)
        logger.exception(message)

        App.objects.to_state(app_code, app_old_state)

        _save_record(record, operate_id=OperateIDEnum.TO_OFFLINE.value, message=message, is_success=False)

        return False, None

#########################
#  saas app deployment  #
#########################


def saas_app_to_online_task(saas_app_version, username):
    """
    上线操作后台任务
    """
    saas_app = saas_app_version.saas_app
    app = saas_app.app
    app_code = app.code

    # FIXME: should get those info from saas app.yml
    bugs = ''
    features = ''
    is_tips = '1'

    saas_settings = saas_app_version.gen_saas_settings_for_deploy()
    app_old_state = app.state

    ok, event_id, message = _call_release_app(app_code=app_code,
                                              app=app,
                                              app_old_state=app_old_state,
                                              to_state=AppStateEnum.IN_ONLINE.value,
                                              operate_user=username,
                                              in_operate_id=OperateIDEnum.IN_ONLINE.value,
                                              to_operate_id=OperateIDEnum.TO_ONLINE.value,
                                              mode='prod',
                                              is_tips=is_tips, features=features, bugs=bugs,
                                              is_saas=True,
                                              saas_settings=saas_settings,
                                              )
    return ok, event_id, message
