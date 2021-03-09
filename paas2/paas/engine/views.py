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
from django.utils.translation import ugettext as _

from common.decorators import has_system_ops_permission
from common.mymako import render_mako_context, render_json
from common.log import logger
from common.exceptions import PaaSErrorCodes

from engine.api import get_agent_healthz, check_services_status, delete_server
from engine.constants import THIRD_SERVER_CATEGORY_CHOICES
from engine.models import BkServer, ThirdServer
from engine.validators import validate_app_server_info, validate_third_server_info


def _gen_json(result, msg, data=None):
    if not data:
        data = {}
    return render_json({"result": result, "msg": msg, "data": data})


@has_system_ops_permission
def servers(request):
    """
    AppServer信息页面
    """
    servers = BkServer.objects.all()
    return render_mako_context(request, "engine/servers.html", {"servers": servers})


@has_system_ops_permission
def add_server_info(request):
    """
    添加/编辑AppServer信息
    """
    server_id = request.POST.get("server_id", "")
    server_ip = request.POST.get("server_ip", "")
    server_port = request.POST.get("server_port", "")
    app_port = request.POST.get("app_port", "")
    server_category = request.POST.get("server_cate", "")

    is_valid, message = validate_app_server_info(server_ip, server_port, app_port, server_category)
    if not is_valid:
        return _gen_json(False, message)

    # 验证 ip & port 是否重复
    bkservers = BkServer.objects.exclude(id=server_id) if server_id else BkServer.objects.all()

    server_count = bkservers.filter(ip_address=server_ip, ip_port=server_port).count()
    if server_count > 0:
        msg = _(u"IP为[{ip}], 端口为 [{port}] 的服务器已经存在").format(ip=server_ip, port=server_port)
        return _gen_json(False, msg)

    # 编辑信息
    if server_id:
        BkServer.objects.filter(id=server_id).update(
            ip_address=server_ip, ip_port=server_port, app_port=app_port, category=server_category
        )
        data = {}
        return _gen_json(True, _(u"保存成功"), data)

    try:
        server = BkServer.objects.create(
            ip_address=server_ip, ip_port=server_port, app_port=app_port, category=server_category, is_active=False
        )
        data = {"server_id": server.id, "s_id": str(server.s_id), "token": str(server.token)}
    except Exception as e:
        logger.exception(u"save server info fail:%s" % e)
        return _gen_json(False, _(u"保存出错"))
    return _gen_json(True, _(u"保存成功"), data)


@has_system_ops_permission
def del_server_info(request):
    """
    删除AppServer信息
    """
    server_id = request.POST.get("server_id", "")
    if not server_id:
        return _gen_json(False, _(u"请选择要删除的服务器"))

    try:
        delete_server(server_id)
    except Exception:
        logger.exception("delete server from engine fail: %s", server_id)

    try:
        BkServer.objects.filter(id=server_id).delete()
    except Exception:
        logger.exception(u"delete server info [id:%s] fail" % server_id)
        return _gen_json(False, _(u"删除服务器失败"))

    return _gen_json(True, _(u"删除成功"))


@has_system_ops_permission
def active_server(request):
    """
    激活服务器
    """
    server_id = request.POST.get("server_id", "")
    try:
        server = BkServer.objects.get(id=server_id)
    except Exception:
        logger.exception(u"server info [id:%s] not exist" % server_id)
        return _gen_json(False, _(u"服务器信息不存在,请重新添加"))

    if server.is_active:
        return _gen_json(True, _(u"服务器已激活"))

    # 2017-02-28 支持多台
    # V1 版本 判断 测试环境/正式环境 分别只能激活一台服务器
    # server_category = server.category
    # active_servers = BkServer.objects.exclude(id=server_id).filter(category=server_category, is_active=True)
    # if active_servers.exists():
    # active_server_ip = active_servers[0].ip_address
    # active_server_port = active_servers[0].ip_port
    # active_server_cate = active_servers[0].get_category_display()
    # return render_json({'result': False,
    # 'msg': u"已经有一台%s [IP:%s, 端口:%s] 被激活<br><br>不能再激活其他%s" %
    # (active_server_cate, active_server_ip, active_server_port, active_server_cate)})

    is_success, agents = get_agent_healthz(server_id)
    if not is_success or not isinstance(agents, dict):
        error_message = (
            _(u"%s 检测Agent信息时出错,可能原因:App Engine 未正常启动或App Engine接口异常") % PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR
        )
        logger.info(error_message)
        return _gen_json(False, error_message)

    s_id = str(server.s_id)
    if s_id not in agents.keys():
        error_message = u"%s 服务器上未安装Agent, 请安装Agent后重试" % PaaSErrorCodes.E1301103_PAASAGENT_NOT_INSTALLED
        logger.info(error_message)
        error_message = _(u"%s 服务器上未安装Agent, 请安装Agent后重试") % PaaSErrorCodes.E1301103_PAASAGENT_NOT_INSTALLED
        return _gen_json(False, error_message)

    agent_data = agents.get(s_id, {})
    agent_code = agent_data.get("code", "")
    if agent_code != 0:
        msg_fmt = _(
            u"PaasAgent激活失败[%s], 可能原因:<br><br>1) 对应机器上未安装PaaSAgent, "
            u"请按文档指引安装PaaSAgent后重试<br><br>2) 部署PaasAgent未正常启动, "
            u"请查看日志定位原因<br><br>日志默认在 ${BK_HOME}/logs/paas_agent/agent.log"
        )
        msg = msg_fmt % PaaSErrorCodes.E1301103_PAASAGENT_NOT_HEALTH
        logger.info(msg)
        return _gen_json(False, msg)

    # 获取服务器的mac地址
    server_mac = agent_data.get("mac", "")
    server.is_active = True
    server.mac = server_mac
    server.save()
    return _gen_json(True, _(u"服务器已激活"))


@has_system_ops_permission
def refresh_server(request):
    """
    刷新agent服务器状态
    """
    server_id = request.POST.get("server_id", "")
    try:
        server = BkServer.objects.get(id=server_id)
    except Exception:
        logger.exception(u"server info [id:%s] not exist" % server_id)
        return _gen_json(False, _(u"服务器信息不存在,请重新添加"))

    is_success, agents = get_agent_healthz(server_id)
    s_id = str(server.s_id)

    if not (is_success and isinstance(agents, dict)):
        error_message = (
            _(u"%s 刷新Agent信息时出错,可能原因:App Engine 未正常启动或App Engine接口异常") % PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR
        )
        return _gen_json(False, error_message)

    agent_data = agents.get(s_id, {})
    agent_code = agent_data.get("code", "")

    msg = (
        _(
            u"%s 检测到服务器状态异常,可能原因:<br><br>1) 对应机器上未安装PaasAgent, "
            u"请按文档指引安装PaaSAgent后重试<br><br>2) 部署PaasAgent未正常启动, 请查看日志定位原因<br><br> "
            u"日志默认在 ${BK_HOME}/logs/paas_agent/agent.log"
        )
        % PaaSErrorCodes.E1301103_PAASAGENT_NOT_HEALTH
    )
    agent_msg = _(u"服务器已激活") if agent_code == 0 else msg

    server.is_active = True if agent_code == 0 else False
    server.save()
    # FIXME: response schema invalid
    return render_json({"result": True, "code": agent_code, "msg": agent_msg})


################
#  第三方服务  #
################

# NOTE: 暂时只支持 rabbitMQ


@has_system_ops_permission
def third_servers(request):
    servers = ThirdServer.objects.all()

    third_cates = []
    for k, v in THIRD_SERVER_CATEGORY_CHOICES:
        third_cates.append((k, _(v)))

    return render_mako_context(request, "engine/third_servers.html", {"servers": servers, "third_cates": third_cates})


@has_system_ops_permission
def add_third_server_info(request):
    """
    添加\编辑第三方服务信息
    """
    server_id = request.POST.get("server_id", "")
    server_ips = request.POST.get("server_ips", "")
    server_port = request.POST.get("server_port", "")
    server_category = request.POST.get("server_cate", "")
    username = request.POST.get("username", "")
    password = request.POST.get("password", "")

    server_ips = server_ips.strip(" ;")
    is_valid, message = validate_third_server_info(server_ips, server_port, username, password, server_category)
    if not is_valid:
        return _gen_json(False, message)

    servers = ThirdServer.objects.exclude(id=server_id) if server_id else ThirdServer.objects.all()
    # IP、端口不能重复
    for _server in servers:
        old_ips = set(_server.ip_address.split(";"))
        new_ips = set(server_ips.split(";"))

        common_ips = old_ips.intersection(new_ips)
        if common_ips and _server.ip_port == server_port:
            common_ip_str = ";".join(list(common_ips))
            msg = _(u"地址为[{ip}], 端口为 [{port}] 的服务器已经存在").format(ip=common_ip_str, port=server_port)
            return _gen_json(False, msg)

    # 服务器基本信息以josn串的形式存储
    server_info = json.dumps(
        {
            "ip_address": server_ips,
            "ip_port": server_port,
            "username": username,
            "password": password,
        }
    )

    # 编辑信息
    if server_id:
        ThirdServer.objects.filter(id=server_id).update(server_info=server_info, category=server_category)
        data = {}
        return _gen_json(True, _(u"保存成功"), data)

    try:
        server = ThirdServer.objects.create(server_info=server_info, category=server_category, is_active=False)
        data = {
            "server_id": server.id,
        }
    except Exception as e:
        logger.exception(u"save server info fail:%s" % e)
        return _gen_json(False, _(u"保存出错"))
    return _gen_json(True, _(u"保存成功"), data)


@has_system_ops_permission
def del_third_server_info(request):
    """
    删除第三方服务
    """
    server_id = request.POST.get("server_id", "")
    if not server_id:
        return _gen_json(False, _(u"请选择要删除的服务"))

    try:
        ThirdServer.objects.filter(id=server_id).delete()
    except Exception:
        logger.exception(u"deleter server [id:%s] fail" % server_id)
        return _gen_json(False, _(u"删除服务失败"))

    return _gen_json(True, _(u"删除成功"))


@has_system_ops_permission
def active_third_server(request):
    """
    激活第三方服务
    """
    server_id = request.POST.get("server_id", "")
    try:
        server = ThirdServer.objects.get(id=server_id)
    except Exception:
        logger.exception(u"server info [id:%s] not exist" % server_id)
        return _gen_json(False, _(u"服务信息不存在,请重新添加"))

    if server.is_active:
        return _gen_json(True, _(u"服务已激活"))

    # # V1 版本 判断只能激活一台服务器
    server_category = server.category
    active_servers = ThirdServer.objects.exclude(id=server_id).filter(category=server_category, is_active=True)
    if active_servers.exists():
        # active_server_cate = active_servers[0].get_category_display()
        active_server_cate = active_servers[0].category_display
        msg = _(u"已经有一个 %s 服务集群被激活<br><br>不能再激活其他 %s 服务集群") % (active_server_cate, active_server_cate)
        return _gen_json(False, msg)

    # 调用engine接口判断服务是否已被激活
    is_success, res_data = check_services_status(server_category, server_id)
    if not (is_success and isinstance(res_data, dict)):
        error_message = (
            _(u"%s 检测服务信息时出错,可能原因:App Engine 未正常启动或App Engine接口异常") % PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR
        )
        logger.info(error_message)
        return _gen_json(False, error_message)

    # 处理失败
    if res_data.get("code", "") != 0:
        msg = res_data.get("msg", "")
        return _gen_json(False, msg)

    # 成功
    server.is_active = True
    server.save()
    return _gen_json(True, _(u"服务已激活"))


@has_system_ops_permission
def refresh_third_server(request):
    """
    刷新agent服务器状态
    """
    server_id = request.POST.get("server_id", "")
    try:
        server = ThirdServer.objects.get(id=server_id)
        server_category = server.category
    except Exception:
        logger.exception(u"server info [id:%s] not exist" % server_id)
        return _gen_json(False, _(u"服务器信息不存在,请重新添加"))

    # 调用engine接口判断服务是否已被激活
    is_success, res_data = check_services_status(server_category, server_id)
    if not (is_success and isinstance(res_data, dict)):
        error_message = (
            _(u"%s 刷新服务信息时出错,可能原因:App Engine 未正常启动或App Engine接口异常") % PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR
        )
        logger.info(error_message)
        return _gen_json(False, error_message)

    server_code = res_data.get("code", "")

    msg = _(u"服务已激活") if server_code == 0 else res_data.get("msg", _(u"检测到服务状态异常"))
    server.is_active = True if server_code == 0 else False
    server.save()
    # FIXME: invalid response schema
    return render_json({"result": True, "code": server_code, "msg": msg})
