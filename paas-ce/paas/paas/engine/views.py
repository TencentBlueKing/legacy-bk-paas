# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.views.generic import View

from common.exceptions import BadRequestException
from common.log import logger
from common.mixins.base import SuperuserRequiredMixin
from common.responses import FailJsonResponse, OKJsonResponse
from common.utils import first_error_message
from common.views.mako import MakoTemplateView
from components.engine import activate_agent, activate_service
from engine.forms import ExternalServerForm, ServerForm
from engine.models import THIRD_SERVER_CATEGORY_CHOICES, BkServer, ThirdServer


class ServerView(SuperuserRequiredMixin, MakoTemplateView):
    """AppServer信息页面
    """
    template_name = 'engine/server.html'

    def get_context_data(self, **kwargs):
        context = super(ServerView, self).get_context_data(**kwargs)
        context.update({
            'servers': BkServer.objects.all()
        })
        return context

    def post(self, request):
        """添加/编辑AppServer信息
        """
        form = ServerForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            raise BadRequestException(message)

        server_id = form.cleaned_data["server_id"]
        server_ip = form.cleaned_data["server_ip"]
        server_port = form.cleaned_data["server_port"]
        app_port = form.cleaned_data["app_port"]
        server_cate = form.cleaned_data["server_cate"]

        # 验证 ip & port 是否重复
        if BkServer.objects.is_server_exists(server_id, server_ip, server_port):
            message = "IP为[{ip}], 端口为 [{port}] 的服务器已经存在".format(ip=server_ip, port=server_port)
            return FailJsonResponse(message)

        # 编辑信息
        try:
            data = BkServer.objects.update_or_create_server(server_id, server_ip, server_port,
                                                            app_port, server_cate)
            return OKJsonResponse("保存成功", data=data)
        except Exception as e:
            logger.exception("保存应用服务器信息异常:%s", e)
            return FailJsonResponse("保存出错", data={})


class ServerDetailView(SuperuserRequiredMixin, View):
    def delete(self, request, server_id):
        """删除AppServer信息
        """
        if not server_id:
            raise BadRequestException("请选择要删除的服务器")

        try:
            BkServer.objects.filter(id=server_id).delete()
        except Exception:
            logger.exception("删除服务器[id:%s]失败", server_id)
            return FailJsonResponse("删除服务器失败")
        return OKJsonResponse("删除成功")


class ActivateServerView(SuperuserRequiredMixin, View):
    """激活服务器
    """
    def post(self, request):
        server_id = request.POST.get('server_id', '')
        try:
            server = BkServer.objects.get(id=server_id)
        except Exception:
            logger.exception("服务器信息[id:%s]不存在", server_id)
            return FailJsonResponse("服务器信息不存在,请重新添加")

        if server.is_active:
            return OKJsonResponse("服务器已激活")

        # V1 版本 判断 测试环境/正式环境 分别只能激活一台服务器
        active_server = BkServer.objects.category_has_active_server(server.category, server_id)
        if active_server:
            message = "已经有一台{} [IP:{}, 端口:{}] 被激活<br><br>不能再激活其他{}".format(
                active_server.get_category_display(),
                active_server.ip_address,
                active_server.ip_port,
                active_server.get_category_display()
            )
            return FailJsonResponse(message)

        ok, message = activate_agent(server_id)
        if not ok:
            return FailJsonResponse("服务器激活失败: {}".format(message))

        return OKJsonResponse("服务器已激活")


class RefreshServerView(SuperuserRequiredMixin, View):
    """刷新agent服务器状态
    """
    def post(self, request):
        server_id = request.POST.get('server_id', '')
        try:
            BkServer.objects.get(id=server_id)
        except Exception:
            logger.exception("服务器信息[id:%s]不存在", server_id)
            return FailJsonResponse("服务器信息不存在,请重新添加")

        ok, message = activate_agent(server_id)
        if not ok:
            return FailJsonResponse("服务器激活失败: {}".format(message))

        return OKJsonResponse("刷新成功")


class ExternalServerView(SuperuserRequiredMixin, MakoTemplateView):
    """第三方信息页面
    """
    template_name = 'engine/external_server.html'

    def get_context_data(self, **kwargs):
        context = super(ExternalServerView, self).get_context_data(**kwargs)
        servers = ThirdServer.objects.all()

        context.update({'servers': servers, 'third_cates': THIRD_SERVER_CATEGORY_CHOICES})
        return context

    def post(self, request):
        """添加/编辑第三方服务信息
        """
        form = ExternalServerForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            raise BadRequestException(message)

        server_id = form.cleaned_data["server_id"]
        server_ip = form.cleaned_data["server_ip"]
        server_port = form.cleaned_data["server_port"]
        server_cate = form.cleaned_data["server_cate"]
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]

        if ThirdServer.objects.is_server_exists(server_id, server_ip, server_port):
            message = "IP为[{ip}], 端口为 [{port}] 的服务器已经存在".format(ip=server_ip, port=server_port)
            return FailJsonResponse(message)

        try:
            data = ThirdServer.objects.update_or_create_server(server_id, server_ip, server_port,
                                                               username, password, server_cate)
            return OKJsonResponse("保存成功", data=data)
        except Exception as e:
            logger.exception("保存服务信息异常:%s", e)
            return FailJsonResponse("保存出错", data={})


class ExternalServerDetailView(SuperuserRequiredMixin, View):
    def delete(self, request, server_id):
        """删除第三方服务
        """
        if not server_id:
            raise BadRequestException('请选择要删除的服务')

        try:
            ThirdServer.objects.filter(id=server_id).delete()
        except Exception:
            logger.exception("删除服务[id:%s]失败", server_id)
            return FailJsonResponse("删除服务失败")
        return OKJsonResponse("删除成功")


class ActivateExternalServerView(SuperuserRequiredMixin, View):
    """激活第三方服务
    """
    def post(self, request):
        server_id = request.POST.get('server_id', '')
        try:
            server = ThirdServer.objects.get(id=server_id)
        except Exception:
            logger.exception("服务信息[id:%s]不存在", server_id)
            return FailJsonResponse("服务信息不存在,请重新添加")

        if server.is_active:
            return FailJsonResponse("服务已激活")

        # V1 版本 判断只能激活一台服务器
        active_server = ThirdServer.objects.category_has_active_server(server.category, server_id)
        if active_server:
            message = "已经有一台 {} 服务被激活<br><br>不能再激活其他 {} 服务".format(
                active_server.get_category_display(), active_server.get_category_display()
            )
            return FailJsonResponse(message)

        ok, message = activate_service(server.category, server_id)
        if not ok:
            return FailJsonResponse("服务激活失败: {}".format(message))

        return OKJsonResponse("服务已激活")


class RefreshExternalServerView(SuperuserRequiredMixin, View):
    """刷新agent服务器状态
    """
    def post(self, request):
        server_id = request.POST.get('server_id', '')
        try:
            server = ThirdServer.objects.get(id=server_id)
        except Exception:
            logger.exception("服务器信息[id:%s]不存在", server_id)
            return FailJsonResponse("服务器信息不存在,请重新添加")

        ok, message = activate_service(server.category, server_id)
        if not ok:
            return FailJsonResponse("服务刷新失败: {}".format(message))

        return OKJsonResponse("服务刷新成功")
