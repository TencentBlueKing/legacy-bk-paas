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
import json

from django.utils.translation import ugettext as _

from common.log import logger
from common.constants import ModeEnum
from common.exceptions import PaaSErrorCodes
from engine.api import release_app, unrelease_app
from engine.models import ThirdServer
from app.models import App, SecureInfo
from app.constants import AppStateEnum
from app_env.models import AppEnvVar
from release.models import Record, Version
from release.constants import OperateIDEnum, StatusEnum, DEPLOY_ERROR_DICT

try:
    from storage.utils import gen_storage_deploy_env_vars
except Exception:

    def gen_storage_deploy_env_vars(app_code, mode):
        return {}


"""
app engine 部署相关

# NOTE: 异常统一在这一层处理
"""

# ============================================= helpers  ==============================================


def _unpack_release_result(result):
    """
    对release_app的参数拆包
    """
    event_id = result.get("event_id") if result else None
    error_code = result.get("error_code", 0) if result else 0

    error_msg = result.get("msg", "") if result else ""

    return event_id, error_code, error_msg


def _build_relase_data(app, mode, is_saas=None, saas_settings=None, servers=None):
    """
    构造release_app中data字段的数据结构
    """
    app_code = app.code

    # deploy_vars
    deploy_vars = SecureInfo.objects.get_app_deploy_vars(app_code=app_code)

    # envs
    is_with_db_info = is_saas
    # FIXME: need to change db info for saas test env
    envs = SecureInfo.objects.get_app_env(app_code, is_with_db_info=is_with_db_info)

    # get env vars from AppEnvVar
    envs.update(AppEnvVar.objects.get_env_vars(app_code=app_code, mode=mode))

    # 理论上, 只有申请了ceph的服务需要检查
    # add storage env
    envs.update(gen_storage_deploy_env_vars(app_code=app_code, mode=mode))

    triggers = dict(is_use_celery=app.is_use_celery, is_use_celery_beat=app.is_use_celery_beat)
    services = ThirdServer.objects.get_mq_services()

    # selected server ids for prod deploy
    if not servers:
        servers = []
    servers = [int(s) for s in servers if s]

    data = dict(envs=envs, triggers=triggers, services=services, servers=servers, mode=mode, deploy_vars=deploy_vars)

    if is_saas is not None:
        data["is_saas"] = is_saas
    if saas_settings is not None:
        data["saas_settings"] = saas_settings

    return data


# ============================================= start outer api for paas ==============================================


def app_to_test_task(app_code, app, username):
    """
    提测后台任务
    """
    app_old_state = app.state
    try:
        # 新建一条记录
        record = Record.objects.create_record(
            app_code=app_code,
            app_old_state=app_old_state,
            operate_user=username,
            operate_id=OperateIDEnum.IN_TEST,
            is_success=StatusEnum.FAIL,
        )

        # 修改状态为 正在提测（状态8）
        App.objects.filter(code=app_code).update(state=AppStateEnum.IN_TEST)

        # 开始提测流程
        auth_token = app.auth_token
        data = _build_relase_data(app, mode=ModeEnum.TEST)
        is_success, result = release_app(app_code=app_code, auth_token=auth_token, data=data)
        event_id, error_code, error_msg = _unpack_release_result(result)

        if not is_success:
            if error_code:
                error_msg = DEPLOY_ERROR_DICT.get(str(error_code))
            else:
                error_msg = _(
                    u"%s 测试部署事件提交失败！请确认 1.appengine服务正常[/v1/healthz/] 2.安装并注册了对应的agent服务器 3.第三方服务等正常 [%s]"
                ) % (PaaSErrorCodes.E1301100_PAASAGENT_COMMIT_TEST_DEPLOYMENT_FAIL, error_msg)

            msg = u"[app:%s] %s, error_code: %s, error_msg: %s" % (
                app_code,
                u"Test deployment events submission failed",
                error_code,
                error_msg,
            )
            logger.info(msg)
            App.objects.filter(code=app_code).update(state=app_old_state)

            # 失败则实时更新状态
            record.update_fields(operate_id=OperateIDEnum.TO_TEST, message=msg, is_success=False)

            return False, None, _(u"测试部署事件提交失败, %s") % error_msg

        msg = u"[app:%s] %s" % (app_code, u"Test deployment events submission succeeded")
        logger.info(msg)
        # 提测成功后  修改状态 为测试中
        # App的状态变更迁移到查询端处理

        # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_TEST, is_success => is_success
        record.update_fields(
            event_id=event_id,
            message=msg,
            extra_data=json.dumps({"task_detail": "", "event_id": event_id, "mode": ModeEnum.TEST}),
        )

        return True, event_id, None
    except Exception as e:
        logger.info(u"[app:%s] %s" % (app_code, u"Test deployment events submission failed"))
        msg = u"[app:%s] Submission for test task failed, error：%s" % (app_code, e)
        logger.exception(msg)

        App.objects.filter(code=app_code).update(state=app_old_state)

        record.update_fields(operate_id=OperateIDEnum.TO_TEST, message=msg, is_success=False)

        return False, None, _(u"测试部署事件提交失败, %s") % str(e)


def app_to_online_task(app_code, app, username, is_tips, features, bugs, servers=None):
    """
    上线操作后台任务
    """
    app_old_state = app.state
    try:
        record = Record.objects.create_record(
            app_code=app_code,
            app_old_state=app_old_state,
            operate_user=username,
            operate_id=OperateIDEnum.IN_ONLINE,
            is_success=StatusEnum.FAIL,
        )

        # 修改应用状态为正在上线（9）
        App.objects.filter(code=app_code).update(state=AppStateEnum.IN_ONLINE)
        # 拿到版本地址
        auth_token = app.auth_token
        data = _build_relase_data(app, mode=ModeEnum.PROD, servers=servers)
        is_success, result = release_app(app_code=app_code, auth_token=auth_token, data=data)
        event_id, error_code, error_msg = _unpack_release_result(result)

        if not is_success:
            if error_code:
                error_msg = DEPLOY_ERROR_DICT.get(str(error_code))
            else:
                error_msg = _(
                    u"%s 正式部署事件提交失败！请确认 1.appengine服务正常[/v1/healthz/] 2.安装并注册了对应的agent服务器 3.第三方服务等正常 [%s]"
                ) % (PaaSErrorCodes.E1301101_PAASAGENT_COMMIT_PROD_DEPLOYMENT_FAIL, error_msg)

            msg = u"[app:%s] %s, error_code: %s, error_msg: %s" % (
                app_code,
                u"Online deployment events submission failed",
                error_code,
                error_msg,
            )
            logger.info(msg)
            App.objects.filter(code=app_code).update(state=app_old_state)

            record.update_fields(operate_id=OperateIDEnum.TO_ONLINE, message=msg, is_success=False)

            return False, None, _(u"上线部署事件提交失败, %s") % error_msg

        # 上线部署事件提交成功
        msg = u"[app:%s] %s" % (app_code, u"Online deployment events submission succeeded")
        logger.info(msg)
        # 保存版本信息
        Version.objects.create_version(app, bugs, features, username)

        # App的状态变更迁移到查询端处理

        # 记录测试环境上线操作（成功和失败均记录）
        extra_data = record.get_extra_data()
        extra_data["task_detail"] = ""
        extra_data["event_id"] = event_id
        extra_data["mode"] = ModeEnum.PROD
        # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_ONLINE, is_success => is_success
        record.update_fields(event_id=event_id, message=msg, is_tips=int(is_tips), extra_data=json.dumps(extra_data))

        return is_success, event_id, None
    except Exception as e:
        # 上线部署事件提交失败
        logger.info(u"[app:%s] %s" % (app_code, u"Online deployment events submission failed"))
        msg = u"[app:%s] There were abnormalities in execution of online tasks, error: %s" % (app_code, e)
        logger.exception(msg)

        App.objects.filter(code=app_code).update(state=app_old_state)

        record.update_fields(operate_id=OperateIDEnum.TO_ONLINE, message=msg, is_success=False)

        return False, None, _(u"上线部署事件提交失败, %s") % str(e)


def app_to_outline_task(app_code, app, username, mode):
    """
    下架操作后台任务
    """
    app_old_state = app.state
    try:
        record = Record.objects.create_record(
            app_code=app_code,
            app_old_state=app_old_state,
            operate_user=username,
            operate_id=OperateIDEnum.IN_OUTLINE,
            is_success=StatusEnum.FAIL,
        )

        # 修改app的状态为正在下架（状态10）
        App.objects.filter(code=app_code).update(state=AppStateEnum.IN_OUTLINE)

        # NOTE: 可能存在多个event_id
        auth_token = app.auth_token
        is_success, event_ids = unrelease_app(app_code, auth_token, mode)

        if not is_success:
            # 下架事件提交失败
            msg = u"[app:%s] %s" % (app_code, u"Removal events submission failed")
            logger.info(msg)
            # 失败, 改为原来的状态
            App.objects.filter(code=app_code).update(state=app_old_state)

            record.update_fields(operate_id=OperateIDEnum.TO_OUTLINE, message=msg, is_success=False)

            return False, None

        # 下架事件提交成功
        msg = u"[app:%s] %s" % (app_code, u"Removal events submission succeeded")
        logger.info(msg)
        # 下架成功后修改app状态为下架
        # App的状态变更迁移到查询端处理

        # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_OUTLINE, is_success => is_success
        # 更新操作记录, 记录第一个event_id, 实际两个都放在 extra_data里面, mode和app_old_state在后面要用到

        extra_data = {"mode": mode, "task_detail": "", "event_ids": event_ids}
        record.update_fields(event_id=event_ids[0], message=msg, extra_data=json.dumps(extra_data))

        return is_success, event_ids[0]
    except Exception as e:
        # 下架事件提交失败
        logger.info(u"[app:%s] %s" % (app_code, u"Removal events submission failed"))
        msg = u"[app:%s] Removal task failed error：%s" % (app_code, e)
        logger.exception(msg)

        App.objects.filter(code=app_code).update(state=app_old_state)

        record.update_fields(operate_id=OperateIDEnum.TO_OUTLINE, message=msg, is_success=False)

        return False, None


#########################
#  for saas deployment  #
#########################


def saas_app_to_online_task(saas_app_version, username, mode, servers=None):
    """
    上线操作后台任务
    """
    saas_app = saas_app_version.saas_app
    app = saas_app.app
    app_code = app.code

    app_old_state = app.state
    try:
        # TODO: fix this
        bugs = ""
        features = ""
        is_tips = "1"

        deploy_name = _(u"测试部署") if mode == ModeEnum.TEST else _(u"正式部署")

        record = Record.objects.create_record(
            app_code=app_code,
            app_old_state=app_old_state,
            operate_user=username,
            operate_id=OperateIDEnum.IN_ONLINE,
            is_success=StatusEnum.FAIL,
        )

        # 修改应用状态为正在上线（9）
        to_state = AppStateEnum.IN_TEST if mode == ModeEnum.TEST else AppStateEnum.IN_ONLINE
        App.objects.filter(code=app_code).update(state=to_state)

        # 拿到版本地址
        auth_token = app.auth_token
        saas_settings = saas_app_version.get_settings_for_deploy()
        data = _build_relase_data(app, mode=mode, is_saas=True, saas_settings=saas_settings, servers=servers)

        # NOTE: saas的测试环境, db_name为 {app_code}_bkt
        if mode == ModeEnum.TEST:
            data["envs"]["DB_NAME"] = "%s_bkt" % data["envs"]["DB_NAME"]

        logger.info("saas app deploy: app_code=%s, auth_token=%s, data=%s" % (app_code, auth_token, data))
        is_success, result = release_app(app_code=app_code, auth_token=auth_token, data=data)
        event_id, error_code, error_msg = _unpack_release_result(result)

        if not is_success:
            if error_code:
                error_msg = DEPLOY_ERROR_DICT.get(str(error_code))
            else:
                paas_error_code = (
                    PaaSErrorCodes.E1301100_PAASAGENT_COMMIT_TEST_DEPLOYMENT_FAIL
                    if mode == ModeEnum.TEST
                    else PaaSErrorCodes.E1301101_PAASAGENT_COMMIT_PROD_DEPLOYMENT_FAIL
                )
                error_msg = _(u"%s %s事件提交失败！请确认 1.appengine服务正常[/v1/healthz/] 2.安装并注册了对应的agent服务器 3.第三方服务等正常 [%s]") % (
                    paas_error_code,
                    deploy_name,
                    error_msg,
                )

            msg = u"Saas App [app:%s] %s, error_code: %s, error_msg: %s" % (
                app_code,
                u"Saas App %s deployment events submission failed" % deploy_name,
                error_code,
                error_msg,
            )

            logger.info(msg)
            App.objects.filter(code=app_code).update(state=app_old_state)

            record.update_fields(operate_id=OperateIDEnum.TO_ONLINE, message=msg, is_success=False)

            return False, None, _(u"Saas App %s事件提交失败, %s") % (deploy_name, error_msg)

        msg = u"[app:%s] %s" % (app_code, u"Saas App %s Events submission succeeded" % deploy_name)
        logger.info(msg)
        # 保存版本信息
        Version.objects.create_version(app, bugs, features, username)

        # App的状态变更迁移到查询端处理

        # 记录测试环境上线操作（成功和失败均记录）
        extra_data = record.get_extra_data()
        extra_data["task_detail"] = ""
        extra_data["event_id"] = event_id
        extra_data["mode"] = mode

        # 操作记录, 注意, 不更新状态operate_id =>OperateIDEnum.TO_ONLINE, is_success => is_success
        record.update_fields(event_id=event_id, message=msg, is_tips=int(is_tips), extra_data=json.dumps(extra_data))

        return is_success, event_id, None
    except Exception as e:
        logger.info(u"[app:%s] %s" % (app_code, u"Saas App %s event submit fail" % deploy_name))
        msg = u"Saas App [app:%s] app %s Exceptions occurred in execution, error: %s" % (app_code, deploy_name, e)
        logger.exception(msg)

        App.objects.filter(code=app_code).update(state=app_old_state)

        record.update_fields(operate_id=OperateIDEnum.TO_ONLINE, message=msg, is_success=False)

        return False, None, _(u"Saas App %s事件提交失败, %s") % (deploy_name, str(e))
