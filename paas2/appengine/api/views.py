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
import re
import logging

from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response

from api import authentication, models, permissions, constants
from api.serializers import BkAppSerializer, BkAppEventSerializer
from api import http
from api.utils import (
    check_rabbitmq,
    apply_mq_res,
    get_category_by_mode,
    update_app_routers,
    delete_server_from_routers,
)
from api.exceptions import EngineErrorCodes
from api.health import get_db_status, get_rabbitmq_status, get_paasagent_status

logger = logging.getLogger("root")


class HealthCheckView(View):
    """
    api {get} /healthz 健康状态
    apiName HealthCheck
    apiGroup App
    apiVersion 1.0.0
    apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
            "OK"
    """

    def get(self, request):
        # check db
        code, msg = get_db_status()
        if code != EngineErrorCodes.E1304000_DEFAULT_CODE:
            return JsonResponse({"code": code, "ok": False, "message": msg, "data": {"mysql": msg}})
        # check agent
        code, msg = get_paasagent_status()
        if code != EngineErrorCodes.E1304000_DEFAULT_CODE:
            return JsonResponse({"code": code, "ok": False, "message": msg, "data": {"paas_agent": msg}})
        # check rabbitmq
        code, msg = get_rabbitmq_status()
        if code != EngineErrorCodes.E1304000_DEFAULT_CODE:
            return JsonResponse({"code": code, "ok": False, "message": msg, "data": {"rabbitmq": msg}})
        return JsonResponse({"code": EngineErrorCodes.E1304000_DEFAULT_CODE, "ok": True, "message": "", "data": {}})

    head = get


class PingView(View):
    """
    api {get} /ping ping状态
    apiName HealthCheck
    apiGroup App
    apiVersion 1.0.0
    apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
            "OK"
    """

    def get(self, request):
        return HttpResponse("pong", content_type="text/plain")


class AgentHealthCheckView(View):
    """
    api {get} /v1/agents/healthz Agent状态
    apiName AgentHealthCheck
    apiGroup App
    apiVersion 1.0.0
    apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
            {
                "agents": {
                    "s_id1": { "code": 0}
                    "s_id2": { "code": 1}
                    }
            }
    """

    def get(self, request):
        try:
            _agents = {}
            server_id = request.GET.get("server_id")
            bk_servers = models.BkServer.objects.filter(id=int(server_id))
            for bk_server in bk_servers:
                ip_address, ip_port, sid, token = (
                    bk_server.ip_address,
                    bk_server.ip_port,
                    bk_server.s_id,
                    bk_server.token,
                )
                _, result = http.http_get("http://{}:{}/v1/app/healthz".format(ip_address, ip_port), sid, token, {})
                if isinstance(result, dict) and result.get("error") == 0:
                    _agents[str(sid)] = {"code": 0, "mac": result.get("mac", "")}
                else:
                    _agents[str(sid)] = {"code": 1}
        except Exception, e:
            return JsonResponse({"msg": "health check failed: %s" % e}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return JsonResponse({"agents": _agents})


class ServiceViewSet(GenericViewSet):
    def check_status(self, *args, **kwargs):
        try:
            service_name = self.kwargs.get("service_name", "")
            params = self.request.query_params
            if service_name == "rabbitmq":
                server_id = params.get("server_id", "")
                if not server_id:
                    return JsonResponse({"code": 1, "msg": "Missing effective server_id"})
                server_data = models.ThirdServer.objects.get(id=server_id).server_data
                server_info = {"server_ip": server_data.get("ip_address"), "server_port": server_data.get("ip_port")}
                admin_account = {"name": server_data.get("username"), "password": server_data.get("password")}
                ret, data = check_rabbitmq(server_info, admin_account)
                if ret:
                    return JsonResponse({"code": 0, "msg": ""})
                else:
                    return JsonResponse({"code": 1, "msg": data})
            else:
                return JsonResponse({"code": 0, "msg": ""})
        except Exception, e:
            return JsonResponse({"code": 1, "msg": str(e)})


class BaseAppViewSet(GenericViewSet):
    authentication_classes = (authentication.AppAuthentication,)
    permission_classes = (permissions.IsAppUser,)

    def get_app(self):
        app = get_object_or_404(models.BkApp, app_code=self.kwargs["app_code"])
        self.check_object_permissions(self.request, app)
        return app


class BaseAgentViewSet(GenericViewSet):
    authentication_classes = (authentication.AgentAuthentication,)
    permission_classes = (permissions.IsAgent,)


class AppViewSet(BaseAppViewSet):
    serializer_class = BkAppSerializer

    def init(self, request, *args, **kwargs):
        """
        api {post} /v1/apps/init App初始化
        apiName AppInit
        apiGroup App
        apiVersion 1.0.0
        apiParam {String} app_code
        apiParam {String} name
        apiParam {String} app_lang
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                 "id": 8,
                 "token": "2b408532-9140-4e82-adde-3f092b467189",
                 "name": "开发框架4",
                 "logo": "",
                 "app_code": "app-tem1plat1e",
                 "app_lang": "Python",
                 "app_type": "1",
                 "is_active": true,
                 "created_at": "2016-03-29T10:04:30.504368Z",
                 "updated_at": "2016-03-29T10:04:30.504460Z"
               }
        """
        app_code = request.data.get("app_code")
        bk_app, created = models.BkApp.objects.update_or_create(app_code=app_code, defaults=request.data)
        if bk_app and created:
            # never use this var
            # bk_app_token = models.BkAppToken.objects.create(bk_app=bk_app)
            models.BkAppToken.objects.create(bk_app=bk_app)
        serializer = BkAppSerializer(bk_app)
        return Response(serializer.data)

    def info(self, *args, **kwargs):
        """
        api {post} /v1/apps/<app_code>/info App信息
        apiName AppInfo
        apiGroup App
        apiVersion 1.0.0
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                 "id": 8,
                 "token": "2b408532-9140-4e82-adde-3f092b467189",
                 "name": "开发框架4",
                 "logo": "",
                 "app_code": "app-tem1plat1e",
                 "app_lang": "Python",
                 "app_type": "1",
                 "is_active": true,
                 "created_at": "2016-03-29T10:04:30.504368Z",
                 "updated_at": "2016-03-29T10:04:30.504460Z"
                 "app_envs": {
                   "test": {
                     "VCS_PATH": "git://xxx",
                     "VCS_PASSWORD": "XXXX",
                     "VCS_USERNAME": "XX" },
                   "prod": {
                     "VCS_PATH": "git://xxx",
                     "VCS_PASSWORD": "XXXX",
                     "VCS_USERNAME": "XX" },
                   }
                 },
               }
        """
        bk_app = self.get_app()
        serializer = BkAppSerializer(bk_app)
        return Response(serializer.data)


class AppReleasesViewSet(BaseAppViewSet):
    def gen_response(self, event_id, error_code, msg):
        return Response({"event_id": event_id, "error_code": error_code, "msg": msg})

    def releases(self, request, *args, **kwargs):
        """
        api {post} /v1/apps/<app_code>/releases App发布
        apiName AppRelease
        apiGroup App
        apiVersion 1.0.0
        apiParam {String} mode (prod/test)
        apiParam {Dict} envs
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                    "event_id": "0103c74f6b87490289bf2b93d9922564",
               }
        """
        mode = request.data.get("mode")
        triggers = request.data.get("triggers", {})
        envs = request.data.get("envs", {})
        # user assign app servers
        server_ids = request.data.get("servers", [])
        bk_app = self.get_app()
        # 生成部署父事件
        bk_event = models.BkEvent.objects.create(event_type="app.{}.online".format(mode), status="READY")
        father_event_id = str(bk_event.id)

        # 申请rabbitMQ资源
        if triggers.get("is_use_celery"):
            try:
                res_kwargs = {
                    "rabbitmq_id": request.data.get("services").get("rabbitmq")[0],
                    "is_use_celery_beat": triggers.get("is_use_celery_beat"),
                }
                self._apply_third_resource(
                    bk_app=bk_app, mode=mode, source_name=constants.THIRD_SERVER_CATEGORY_MQ, envs=envs, **res_kwargs
                )
            except Exception:
                err_msg = u"%s request: %s, Apply MQ Resource failed" % (
                    EngineErrorCodes.E1304201_RABBITMQ_ERROR,
                    request.data,
                )
                logger.exception(err_msg)
                return Response(
                    {"event_id": father_event_id, "error_code": 20300, "msg": err_msg},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # 添加SaaS设置
        if request.data.get("is_saas", False):
            saas_settings = request.data.get("saas_settings", {})
            saas_settings["is_saas"] = "true"
        else:
            saas_settings = {"is_saas": "false"}

        # 分发部署任务
        ret, data = bk_app.releases(
            father_event_id,
            mode,
            server_ids,
            envs,
            deploy_token=request.data.get("deploy_token", ""),
            deploy_vars=request.data.get("deploy_vars", {}),
            saas_settings=saas_settings,
        )
        # 分发部署任务成功
        if ret and data.get("error", 1) == 0:
            return Response({"event_id": father_event_id})

        err_msg = data.get("msg")
        bk_event.status = "FAILURE"
        bk_event.message = err_msg
        bk_event.save()
        logger.error(u"request: %s, Send Release Task To Servers Failed: %s" % (request.data, err_msg))
        return self.gen_response(father_event_id, data.get("error"), err_msg)

    def destroy(self, *args, **kwargs):
        """
        api {delete} /v1/apps/<app_code>/releases App下线
        apiName AppOffline
        apiGroup App
        apiVersion 1.0.0
        apiParam {String} mode (prod/test)
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                    "event_id": "0103c74f6b87490289bf2b93d9922564",
                    "status": "READY",
                    "msg": "msgmsg",
               }
        """
        mode = self.request.data.get("mode")
        bk_app = self.get_app()
        # 生成下架父事件
        bk_event = models.BkEvent.objects.create(event_type="app.{}.offline".format(mode), status="READY")
        father_event_id = str(bk_event.id)

        count = 0
        category = get_category_by_mode(mode)
        bk_hosting_ships = models.BkHostingShip.objects.filter(bk_app=bk_app, is_active=True)
        for bk_hosting_ship in bk_hosting_ships:
            if not bk_hosting_ship.bk_server.is_active:
                continue
            if bk_hosting_ship.bk_server.category == category:
                count += 1

        if count < 1:
            logger.error(
                u"request: %s, Send Release Task To Servers Failed: %s"
                % (
                    self.request.request.data,
                    u"no servers available, "
                    u"you need to install PaaSAgent "
                    u"on at least one server and register the server to PaaS",
                )
            )
            msg = (
                "no servers available, you need to install PaaSAgent "
                "on at least one server and register the server to PaaS"
            )
            return self.gen_response(father_event_id, 20210, msg)

        ret, data = bk_app.offline(father_event_id, mode)
        # 分发下线任务成功
        if ret and data.get("error", 1) == 0:
            return Response({"event_id": father_event_id})

        err_msg = data.get("msg")
        bk_event.status = "FAILURE"
        bk_event.message = err_msg
        bk_event.save()
        logger.error(u"request: %s, Send Offline Task To Servers Failed: %s" % (self.request.data, err_msg))
        return self.gen_response(father_event_id, data.get("error"), err_msg)

    def _apply_third_resource(self, bk_app, mode, source_name, envs, **kwargs):
        if source_name == constants.THIRD_SERVER_CATEGORY_MQ:
            rabbitmq_id = kwargs.get("rabbitmq_id")
            server_data = models.ThirdServer.objects.get(id=rabbitmq_id).server_data

            mq_pwd = str(bk_app.token)[:8]
            app_code = bk_app.app_code
            vhost = "test_%s" % app_code if mode == "test" else "prod_%s" % app_code
            envs["BK_BROKER_URL"] = "amqp://%s:%s@%s:5672/%s" % (app_code, mq_pwd, server_data["ip_address"], vhost)
            envs["IS_USE_CELERY"] = "true"
            envs["IS_USE_CELERY_BEAT"] = "true" if kwargs.get("is_use_celery_beat") else "false"

            server_info = {"server_ip": server_data["ip_address"], "server_port": server_data["ip_port"]}
            admin_account = {"name": server_data["username"], "password": server_data["password"]}
            user_account = {"name": app_code, "password": mq_pwd}
            apply_mq_res(server_info, admin_account, user_account, vhost)
        else:
            raise ValueError(u"%s not supported yet" % source_name)


class AppLogViewSet(BaseAppViewSet):
    def logs(self, *args, **kwargs):
        """
        api {get} /v1/apps/<app_code>/events/<event_id>/logs App事件日志
        apiName AppEventLog
        apiGroup App
        apiVersion 1.0.0
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                    "status": "SUCCESS",
                    "logs": "部署日志",
                    "event_type": "app.prod.online",
                    "app_code": "app-template",
               }
        """
        event_id = self.kwargs["event_id"]
        try:
            father_event = models.BkEvent.objects.get(id=event_id)
        except Exception, e:
            logger.error(
                u"%s Get BkEvent failed: %s, event_id: %s" % (EngineErrorCodes.E1304001_DATABASE_ERROR, e, event_id)
            )
            return JsonResponse({"status": "FAILURE", "logs": u"Get BkEvent failed: %s" % e})

        # 取事件状态
        status = father_event.status

        try:
            master_bk_app_event = models.BkAppEvent.objects.get(bk_event_id=event_id, is_master=True)
        except Exception, e:
            logger.error(
                u"%s Query Master log failed: %s, event_id: %s"
                % (EngineErrorCodes.E1304001_DATABASE_ERROR, e, event_id)
            )
            return JsonResponse(
                {"status": status, "logs": u"Query Master log failed: %s, event_id: %s" % (e, event_id)}
            )

        try:
            slave_bk_app_events = models.BkAppEvent.objects.filter(bk_event_id=event_id, is_master=False)
        except Exception, e:
            logger.error(
                u"%s Query Slave log failed: %s, event_id: %s" % (EngineErrorCodes.E1304001_DATABASE_ERROR, e, event_id)
            )
            return JsonResponse({"status": status, "logs": u"Query Slave log failed: %s" % e})

        # 默认返回master日志，如果存在master成功，slave失败，则返回master + slave
        log_content = "".join(master_bk_app_event.bkappeventlog_set.all().values_list("log", flat=True))
        log_result = {"status": status, "logs": log_content}
        for slave_bk_app_event in slave_bk_app_events:
            logger.debug(u"slave status: %s" % slave_bk_app_event.status)
            if slave_bk_app_event.status == "FAILURE":
                logger.debug(u"slave failed")
                slave_log_content = "".join(slave_bk_app_event.bkappeventlog_set.all().values_list("log", flat=True))
                log_result = {
                    "status": status,
                    "logs": u"%s \n\n\nWarning: Slave-Node failed, "
                    u"Slave-node log:%s" % (log_content, slave_log_content),
                }
                break

        logger.debug(u"track the log result: %s" % log_result)
        return JsonResponse(log_result)


class AppEventLogViewSet(BaseAgentViewSet):
    def create(self, *args, **kwargs):
        """
        api {post} /v1/apps/<app_code>/events/<event_id> App事件日志记录
        apiName AppEventLogCreate
        apiGroup App
        apiVersion 1.0.0
        apiParam {String} status (READY/PENDING/SUCCESS/FAILURE)
        apiParam {Text} log
        apiSuccessExample {json} Success-Response:
            HTTP/1.1 200 OK
               {
                    "status": "SUCCESS",
                    "logs": "部署日志",
               }
        """
        event_id = self.kwargs["event_id"]
        status = self.request.data.get("status")
        log = self.request.data.get("log")
        bk_app_event = models.BkAppEvent.objects.get(id=event_id)
        models.BkAppEventLog.objects.create(bk_app_event=bk_app_event, log=log)
        if status in ["READY", "PENDING", "FAILURE", "SUCCESS"]:
            bk_app_event.status = status
            bk_app_event.save()
        serializer = BkAppEventSerializer(bk_app_event)

        if status == "SUCCESS":
            father_event_id = bk_app_event.bk_event_id
            try:
                father_event_instance = models.BkEvent.objects.get(id=father_event_id)
            except Exception:
                return Response(serializer.data)

            try:
                slave_event_status_list = models.BkAppEvent.objects.filter(bk_event_id=father_event_id).values_list(
                    "status", flat=True
                )
                if len(filter(lambda x: x != "SUCCESS", slave_event_status_list)) == 0:
                    father_event_instance.status = "SUCCESS"
                    father_event_instance.save()

                    app_code = self.kwargs["app_code"]
                    models.update_hostships(app_code, father_event_instance)
                    update_app_routers(app_code, father_event_instance.event_type)

            except Exception:
                return Response(serializer.data)
        elif status == "FAILURE":
            father_event_id = bk_app_event.bk_event_id
            try:
                father_event_instance = models.BkEvent.objects.get(id=father_event_id)
                father_event_instance.status = "FAILURE"
                father_event_instance.save()
            except Exception:
                return Response(serializer.data)

        return Response(serializer.data)


class AgentRegistryView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(AgentRegistryView, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        agent_ip = request.POST.get("agent_ip", "")
        agent_port = request.POST.get("agent_port", "4245")
        mode = request.POST.get("mode", "test")
        web_port = request.POST.get("web_port", "8085")
        if not agent_ip:
            return JsonResponse({"msg": "agent_ip cannot be empty"}, status=400)
        ip_pattarn = re.compile("^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
        if not ip_pattarn.match(agent_ip):
            return JsonResponse({"msg": "invalid agent_ip"}, status=400)
        category = "tapp" if mode == "test" else "app"
        # 服务器注册
        defaults = {"is_active": False, "app_port": web_port, "category": category}
        bk_server, _ = models.BkServer.objects.update_or_create(
            ip_address=agent_ip, ip_port=agent_port, defaults=defaults
        )
        return JsonResponse({"sid": bk_server.s_id, "token": bk_server.token})

    def get(self, request):
        agent_ip = request.GET.get("agent_ip", "")
        try:
            if not agent_ip:
                return JsonResponse({"msg": "agent_ip cannot be empty"}, status=400)
            ip_pattern = re.compile("^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
            if not ip_pattern.match(agent_ip):
                return JsonResponse({"msg": "invalid agent_ip"}, status=400)

            agent_port = request.GET.get("agent_port", "")
            filter_params = {"ip_address": agent_ip}
            if agent_port:
                filter_params["ip_port"] = agent_port

            bk_server = models.BkServer.objects.get(**filter_params)
            _, result = http.http_get(
                "http://{}:{}/v1/app/healthz".format(bk_server.ip_address, bk_server.ip_port),
                bk_server.s_id,
                bk_server.token,
                {},
            )
            if isinstance(result, dict) and result.get("error") == 0:
                bk_server.is_active = True
                bk_server.mac = result.get("mac", "")
                bk_server.save()
                return JsonResponse({"agent_ip": bk_server.ip_address})
            error_msg = "active %s fail, the paas_agent return: %s" % (agent_ip, result)
            return JsonResponse({"msg": error_msg})
        except Exception, e:
            return JsonResponse({"msg": "%s" % e}, status=400)


class MqRegistryView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(MqRegistryView, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        mq_ip = request.POST.get("mq_ip", "")
        if not mq_ip:
            return JsonResponse({"msg": "mq_ip cannot be empty"}, status=400)
        mq_ip = mq_ip.strip(" ")
        mq_port = "15672"
        server_info = {"server_ip": mq_ip, "server_port": mq_port}
        username = request.POST.get("username", "admin")
        password = request.POST.get("password", "admin")
        admin_account = {"name": username, "password": password}
        try:
            ret, data = check_rabbitmq(server_info, admin_account)
            category = "rabbitmq"
            if ret:
                active_server = models.ThirdServer.objects.filter(category=category, is_active=True)
                if active_server:
                    err_msg = (
                        "The rabbitmq cluster has been already activated, thus %s cannot be activated again" % mq_ip
                    )
                    return JsonResponse({"code": 0, "msg": err_msg})
                server_info = {
                    "ip_address": mq_ip,
                    "ip_port": mq_port,
                    "username": username,
                    "password": password,
                }
                server_info = json.dumps(server_info)
                defaults = {"server_info": server_info, "is_active": True}
                models.ThirdServer.objects.update_or_create(category=category, defaults=defaults)
                return JsonResponse({"code": 0, "mq_ip": mq_ip})
            return JsonResponse({"code": 1, "msg": data})
        except Exception, e:
            return JsonResponse({"code": 1, "msg": "%s" % e}, status=400)


class BkServersViewSet(APIView):
    def delete(self, request, server_id):
        try:
            delete_server_from_routers(server_id)
        except Exception, e:
            logger.exception("delete_server_from_routers error!")
            return JsonResponse({"code": EngineErrorCodes.E1304401_ROUTER_ERROR, "msg": "delete server error: %s" % e})

        models.BkHostingShip.objects.filter(bk_server__id=server_id).delete()
        return JsonResponse({"code": 0, "server_id": server_id})
