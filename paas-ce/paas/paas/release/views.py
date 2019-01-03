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
from django.http import JsonResponse
from django.views.generic import View

from app.models import App, SecureInfo
from common.constants import ModeEnum, ModeNameDict
from common.exceptions import BadRequestException
from common.log import logger
from common.mixins.base import AppDeveloperRequiredMixin
from common.responses import FailJsonResponse, OKJsonResponse
from common.views.mako import JsonView, MakoTemplateView
from components.engine import get_event_log
from engine.deploy import (app_to_offline_task, app_to_online_task,
                           app_to_test_task)
from engine.models import BkServer, ThirdServer
from release.constants import (APP_DID_OPERATE_ID_LIST, OPERATE_CODE_LIST, EventStatusEnum,
                               OperateIDEnum, UserOperateTypeEnum, DeployPageTypeEnum)
from release.models import Record, Version
from release.utils import get_event_status, get_release_home_page_data
from release.utils import record_user_release_operate as _r


class HomeView(AppDeveloperRequiredMixin, MakoTemplateView):
    """发布部署 - 首页
    """
    template_name = 'release/home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        request = self.request

        app_code = self.kwargs["app_code"]
        username = request.user.username
        data = get_release_home_page_data(app_code, username)
        context.update(data)

        return context


class RecordPageView(AppDeveloperRequiredMixin, MakoTemplateView):
    """发布记录
    """
    template_name = 'release/record.html'

    def get_context_data(self, **kwargs):
        context = super(RecordPageView, self).get_context_data(**kwargs)
        app_code = self.kwargs["app_code"]
        context.update({"app_code": app_code, "tab": "record"})

        return context


class AppRecordView(AppDeveloperRequiredMixin, MakoTemplateView):
    """获取发布记录页面
    operate_id: 操作对应ID, 0: 全部， 1：提测，  2：上线，3：下架
    """
    template_name = 'release/record_list.part'

    def get_context_data(self, **kwargs):
        context = super(AppRecordView, self).get_context_data(**kwargs)

        app_code = self.kwargs["app_code"]
        operate_code = self.kwargs["operate_code"]
        if operate_code not in OPERATE_CODE_LIST:
            raise BadRequestException("operate_code is invalid")

        query = Record.objects.query_records(app_code, operate_code, size=100)
        record_list = []
        for _record in query:
            # 提测展示信息
            extra_data = _record.get_extra_data()

            if not extra_data:
                task_detail = ''
                extra_msg = '--'
            else:
                task_detail = extra_data.get("task_detail", "")
                if _record.operate_id in [OperateIDEnum.IN_OFFLINE.value, OperateIDEnum.TO_OFFLINE.value]:
                    _extra_data_mode = extra_data.get("mode", ModeEnum.ALL.value)

                    _env = ModeNameDict.get(_extra_data_mode, "--")
                    extra_msg = "选择下架环境：{}".format(_env)
                else:
                    extra_msg = "--"

            is_done = _record.operate_id in APP_DID_OPERATE_ID_LIST

            record_list.append({
                "operate_type": _record.get_operate_id_display(),
                "operate_user": _record.operate_user,
                "is_success": _record.is_success,
                "is_done": is_done,
                "operate_time": _record.operate_time_display,
                "extra_data": extra_msg,
                "detail": _record.message.replace('\n', '<br/>') if _record.message else "没有返回信息！",
                "task_detail": task_detail
            })

        context.update({
            "record_list": record_list,
            "app_code": app_code,
        })
        return context


class ReleaseVersion(AppDeveloperRequiredMixin, MakoTemplateView):
    """版本信息
    app发布历史版本
    """
    template_name = 'release/version.html'

    def get_context_data(self, **kwargs):
        context = super(ReleaseVersion, self).get_context_data(**kwargs)

        app_code = self.kwargs["app_code"]

        app = App.objects.get(code=app_code)
        version_list = Version.objects.get_version_list(app)
        context.update({"app_code": app_code, "version_list": version_list, "tab": "version"})
        return context


class DeployPageView(AppDeveloperRequiredMixin, MakoTemplateView):
    """获取部署页面信息
    """
    def get_template_names(self):
        page_type = self.kwargs["page_type"]

        tpl = "release/{}.part".format(page_type)

        return [tpl]

    def get_context_data(self, **kwargs):
        context = super(DeployPageView, self).get_context_data(**kwargs)

        app_code = self.kwargs["app_code"]
        page_type = self.kwargs["page_type"]

        app = App.objects.get(code=app_code)
        vcs_info = SecureInfo.objects.get_vcs_info(app_code)
        vcs_url = vcs_info.get("VCS_PATH") if vcs_info else '--'
        data = {"app": app,
                "vcs_url": vcs_url,
                "app_code": app_code,
                }

        if page_type == DeployPageTypeEnum.TEST.value:
            data.update({"is_service_rabbitmq_active": ThirdServer.objects.is_rabbitmq_active()})

        context.update(data)
        return context


class ReleaseTestView(AppDeveloperRequiredMixin, View):
    """app提测
    """
    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]
        username = request.user.username

        logger.info("[app:%s] 开始进行[测试部署]...", app_code)

        app = App.objects.get(code=app_code)

        # 检测测试服务器是否激活
        is_test_app_deployable = BkServer.objects.check_test_app_deployable()
        if not is_test_app_deployable:
            message = "当前没有可用的[测试服务器], 无法进行提测操作. 请到<a href='/engine/server/'> [蓝鲸智云-开发者中心-服务器信息] </a> 注册并激活服务器"
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 只有[下架/开发/测试/上线]状态可操作
        can_be_test, message = app.can_be_test()
        if not can_be_test:
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 启用服务
        form_data = request.POST.get("form_data", None)
        if form_data:
            try:
                form_data = json.loads(request.POST.get("form_data"))
            except Exception as e:
                message = "参数错误！"
                logger.exception("[app:%s] %s error=%s", app_code, message, str(e))
                return BadRequestException(message)

            is_use_celery = (form_data.get("is_use_celery") == "checked")
            is_use_celery_beat = (form_data.get("is_use_celery_beat") == "checked")

            try:
                app.trigger_celery(is_use_celery, is_use_celery_beat)
                logger.info("update app info [is_use_celery=%s, is_use_celery_beat=%s]",
                            app.is_use_celery, app.is_use_celery_beat)
            except Exception:
                logger.exception("Update is_use_celery/is_use_celery_beat fail!")

        # 提测
        ok, event_id, message = app_to_test_task(app_code, app, username)

        # 记录操作流水日志
        extra_data = {"username": username, "is_success": ok, "event_id": event_id}
        _r(app_code, username, UserOperateTypeEnum.RELEASE_TEST.value, extra_data)

        if ok:
            message = "测试部署事件提交成功！"
            logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
            return OKJsonResponse(message, event_id=event_id)

        logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
        return FailJsonResponse(message, event_id=event_id)


class ReleaseProductionView(AppDeveloperRequiredMixin, View):
    """app上线
    """
    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]
        username = request.user.username

        logger.info("[app:%s] 开始进行[正式部署]...", app_code)

        app = App.objects.get(code=app_code)

        try:
            form_data = json.loads(request.POST.get("form_data", '{}'))
        except Exception as e:
            message = "参数错误！"
            logger.exception("[app:%s] %s error=%s", app_code, message, e)
            return BadRequestException(message)

        is_prod_app_deployable = BkServer.objects.check_prod_app_deployable()
        if not is_prod_app_deployable:
            message = "当前没有可用的[正式服务器], 无法进行提测操作. 请到<a href='/engine/server/'> [蓝鲸智云-开发者中心-服务器信息] </a> 注册并激活服务器"
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 前端变量不要一直向后, 限制
        is_tips = form_data.get("is_tips", 0)
        features = form_data.get("features", "")
        bugs = form_data.get("bugs", "")

        can_be_online, message = app.can_be_online()
        if not can_be_online:
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 上线操作
        ok, event_id, message = app_to_online_task(app_code, app, username, is_tips, features, bugs)

        # 操作流水日志
        extra_data = {"username": username, "form_data": form_data}
        _r(app_code, username, UserOperateTypeEnum.RELEASE_ONLINE.value, extra_data)

        if not ok:
            logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
            return FailJsonResponse(message, event_id=event_id)

        message = "正式部署事件提交成功！"
        logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
        return OKJsonResponse(message, event_id=event_id)


class ReleaseOfflineView(AppDeveloperRequiredMixin, MakoTemplateView):
    """app下架
    发布部署 - 下架首页
    发布部署 - 执行下架
    """
    template_name = 'release/home.html'

    def get_context_data(self, **kwargs):
        context = super(ReleaseOfflineView, self).get_context_data(**kwargs)
        request = self.request

        app_code = self.kwargs["app_code"]
        username = request.user.username

        data = get_release_home_page_data(app_code, username, page="unrelease")
        context.update(data)

        return context

    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]
        username = request.user.username

        logger.info("[app:%s] 开始进行[下架]...", app_code)

        try:
            form_data = json.loads(request.POST.get("form_data", '{}'))
        except Exception:
            message = "参数错误！"
            logger.exception("[app:%s] %s", app_code, message)
            return BadRequestException(message)

        # NOTE: 下架不加检查服务器, 因为此时已经提测/上线的, 所以默认可以下架成功
        # 获取应用基本信息
        app = App.objects.get(code=app_code)

        # 状态判定
        mode = form_data.get("mode", "all")
        can_be_offline, message = app.can_be_offline(mode)
        if not can_be_offline:
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 执行下架
        app_old_state = app.state
        auth_token = app.auth_token
        ok, event_id = app_to_offline_task(app_code, auth_token, username, mode, app_old_state)

        # 操作流水日志
        extra_data = {"username": username, "form_data": form_data}
        _r(app_code, username, UserOperateTypeEnum.RELEASE_OFFLINE.value, extra_data)

        if ok:
            message = "下架事件提交成功！"
            logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
            return OKJsonResponse(message, event_id=event_id)

        message = "下架事件提交失败！"
        logger.info("[app:%s] %s event_id: %s", app_code, message, event_id)
        return FailJsonResponse(message, event_id=event_id)


class ApplicationDeleteView(AppDeveloperRequiredMixin, View):
    """删除应用
    """
    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]
        logger.info("[app:%s] 开始进行[删除]...", app_code)

        username = request.user.username

        app = App.objects.get(code=app_code)
        can_be_deleted, message = app.can_be_deleted(username)
        if not can_be_deleted:
            logger.info("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        try:
            SecureInfo.objects.filter(app_code=app_code).delete()
            App.objects.filter(code=app_code).delete()
            # 将APP的发布记录保存为上一次，避免下次创建时显示冲突
            Record.objects.filter(app_code=app_code).update(version='last')
        except Exception:
            message = "删除失败！"
            logger.exception("[app:%s] %s", app_code, message)
            return FailJsonResponse(message)

        # 操作流水日志
        extra_data = {"username": username}
        _r(app_code, username, UserOperateTypeEnum.APP_DELETE.value, extra_data)

        message = "删除成功！"
        logger.info("[app:%s] %s", app_code, message)
        return OKJsonResponse(message)


class EventStatusView(AppDeveloperRequiredMixin, View):
    """查询事件状态
    app 提测、上线、下架后台任务状态轮询
    @return: result：0：失败，1：成功，2：正在执行
    """
    def get(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]

        event_id = request.GET.get("event_id", '')
        ok, message, data = get_event_status(event_id, app_code, request=request)
        result = {
            "result": ok,
            "message": message,
            "data": data
        }
        return JsonResponse(result)


class UnfinishedTaskView(AppDeveloperRequiredMixin, View):
    """到app engine检查并更新最近10条未完成的task的状态
    """
    def get(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]

        app = App.objects.get(code=app_code)

        records = Record.objects.get_last_ongoing_records(app_code, size=10)
        for record in records:
            event_id = record.event_id
            event_ids = [event_id]
            if record.operate_id == OperateIDEnum.IN_OFFLINE.value:
                try:
                    event_ids = json.loads(record.extra_data).get("event_ids", [])
                except Exception:
                    event_ids = [event_id]

            ok, data = get_event_log(app_code=app_code, auth_token=app.auth_token, event_ids=event_ids)
            if not ok:
                continue

            status = data.get("status")
            # 判定操作时间, 超过了, 就判定是超时, 直接失败
            expire_seconds = (datetime.datetime.now() - record.operate_time).total_seconds()
            if (expire_seconds > settings.HISTORY_EVENT_STATE_EXPIRE_SECONDS
                    and status != EventStatusEnum.SUCCESS.value):
                message = "check_unfinished_task, 事件超时({}s), 设置为失败".format(settings.HISTORY_EVENT_STATE_EXPIRE_SECONDS) # noqa
                logger.info("[app:%s] %s, event_id:%s", app_code, message, event_id)
                record.message = message
                status = EventStatusEnum.FAILURE.value

            if status in (EventStatusEnum.SUCCESS.value, EventStatusEnum.FAILURE.value):
                record.is_success = (status == EventStatusEnum.SUCCESS.value)

                to_operate_id = {OperateIDEnum.IN_TEST.value: OperateIDEnum.TO_TEST.value,
                                 OperateIDEnum.IN_ONLINE.value: OperateIDEnum.TO_ONLINE.value,
                                 OperateIDEnum.IN_OFFLINE.value: OperateIDEnum.TO_OFFLINE.value
                                 }.get(record.operate_id, record.operate_id)
                record.operate_id = to_operate_id

                record.save()

        return OKJsonResponse("success")


class LastReleaseRecordView(AppDeveloperRequiredMixin, JsonView):
    """获取部署最新的一条记录，用于刷新页面后继续轮询部署状态
    """
    def get_context_data(self, **kwargs):
        context = super(LastReleaseRecordView, self).get_context_data(**kwargs)

        app_code = self.kwargs["app_code"]
        try:
            # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
            record = Record.objects.get_app_newest_record(app_code)
            context.update({
                "result": True,
                "message": "success",
                "data": {
                    "record_id": record.id,
                    "event_id": record.event_id
                }
            })
            return context
        except Exception:
            message = "[app:{}] {}".format(app_code, "get_last_release_record 查询错误！")
            logger.exception(message)
            context.update({
                "result": False,
                "message": message,
                "data": {}
            })
            return context
