# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import logging

from django.views.generic import View
from django.http import JsonResponse

from api import models, forms, servicemanager
from api.baseview import BaseView, AgentView, AppView
from api.response import OKJsonResponse, FailJsonResponse
from api.utils import get_server_category, has_active_server, check_agent_health, has_active_thirdserver
from api.deployment import DeployController

logger = logging.getLogger("root")


class AgentViewSet(BaseView):
    def put(self, request, agent_ip):
        try:
            bk_server = models.BkServer.objects.get(ip_address=agent_ip)
        except Exception, e:
            return FailJsonResponse("active server ip %s exception: %s" % (agent_ip, e))

        if not bk_server.is_active and has_active_server(bk_server.category):
            return FailJsonResponse(
                "%s environment has already one activated server, thus ip %s cannot be activated again"
                % (bk_server.category, agent_ip))

        try:
            resp = check_agent_health(bk_server)
            bk_server.is_active = True
            bk_server.mac = resp.get("mac", "")
            bk_server.save()
            return OKJsonResponse(data={"agent_ip": bk_server.ip_address})
        except Exception, e:
            bk_server.is_active = False
            bk_server.save()
            err_msg = "active server ip %s exception: %s" % (agent_ip, e)
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)

    def post(self, request):
        form_data = forms.AgentRegisterForm(request.json_data)
        if not form_data.is_valid():
            err_msg = form_data.errors
            return FailJsonResponse(err_msg)

        data = form_data.clean()

        server_category = get_server_category(data["mode"])
        server_params = {
            "ip_address": data["agent_ip"],
            "app_port": data["web_port"],
            "ip_port": data["agent_port"],
            "category": server_category,
        }
        try:
            bk_server = models.BkServer.objects.get(**server_params)
        except models.BkServer.DoesNotExist:
            server_params["is_active"] = False
            bk_server = models.BkServer.objects.create(**server_params)
        return OKJsonResponse(data={"sid": bk_server.s_id, "token": bk_server.token})


class AgentActiveViewSet(BaseView):
    def put(self, request, server_id):
        try:
            bk_server = models.BkServer.objects.get(id=server_id)
        except models.BkServer.DoesNotExist:
            return FailJsonResponse("id %s server not registered")

        if not bk_server.is_active and has_active_server(bk_server.category):
            return FailJsonResponse(
                "%s environment has already one activated server, thus id %s cannot be activated again"
                % (bk_server.category, server_id))

        try:
            resp = check_agent_health(bk_server)
            bk_server.is_active = True
            bk_server.mac = resp.get("mac", "")
            bk_server.save()
            return OKJsonResponse(data={"server_id": server_id})
        except Exception, e:
            bk_server.is_active = False
            bk_server.save()
            err_msg = "active server id %s exception: %s" % (server_id, e)
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)


class AppViewSet(AppView):
    def post(self, request):
        form_data = forms.AppInitForm(request.json_data)
        if not form_data.is_valid():
            err_msg = form_data.errors
            return FailJsonResponse(err_msg)

        data = form_data.clean()
        bk_app, created = models.BkApp.objects.update_or_create(
            app_code=data["app_code"],
            defaults={"name": data["name"], "app_lang": data["app_lang"]})
        if bk_app and created:
            models.BkAppToken.objects.create(bk_app=bk_app)

        return OKJsonResponse(data=bk_app.serializer_data())

    def get(self, request, app_code):
        try:
            bk_app = models.BkApp.objects.get(app_code=app_code)
        except Exception, e:
            return FailJsonResponse(str(e))
        return OKJsonResponse(data=bk_app.serializer_data())


class AppReleaseViewSet(AppView):
    def post(self, request, app_code, mode):
        try:
            bk_app = models.BkApp.objects.get(app_code=app_code)
        except Exception, e:
            return FailJsonResponse(str(e))

        # add saas fields in envs only for agent
        if request.json_data.get('is_saas', False):
            saas_settings = request.json_data.get('saas_settings', {})
            saas_settings['is_saas'] = 'true'
        else:
            saas_settings = {'is_saas': 'false'}

        deploy_config = {
            "envs": request.json_data.get('envs', {}),
            "triggers": request.json_data.get('triggers', {}),
            "deploy_token": request.json_data.get("deploy_token", ''),
            "deploy_vars": request.json_data.get("deploy_vars", {}),
            "saas_settings": saas_settings
        }
        deploy_controller = DeployController(bk_app, mode, deploy_config)
        event_id, error_code, message = deploy_controller.online()

        data = {"event_id": event_id, "error_code": error_code}
        if error_code == 0:
            return OKJsonResponse(data=data)

        return FailJsonResponse(message, data=data)

    def delete(self, request, app_code, mode):
        try:
            bk_app = models.BkApp.objects.get(app_code=app_code)
        except Exception, e:
            return FailJsonResponse(str(e))

        deploy_controller = DeployController(bk_app, mode, {})
        event_id, error_code, message = deploy_controller.offline()
        data = {"event_id": event_id, "error_code": error_code}
        if error_code == 0:
            return OKJsonResponse(data=data)
        return FailJsonResponse(message, data=data)


class AppLogsViewSet(AppView):
    def get(self, request, app_code, event_id):
        try:
            bk_app = models.BkApp.objects.get(app_code=app_code)
            bk_app_event = models.BkAppEvent.objects.get(id=event_id, bk_app=bk_app)
        except Exception, e:
            return FailJsonResponse(str(e))
        return OKJsonResponse(data=bk_app_event.serializer_data())


class AppEventLogsViewSet(AgentView):

    def post(self, request, app_code, event_id):
        try:
            bk_app = models.BkApp.objects.get(app_code=app_code)
            bk_app_event = models.BkAppEvent.objects.get(id=event_id, bk_app=bk_app)
        except Exception, e:
            return FailJsonResponse(str(e))

        form_data = forms.AppEventLogsForm(request.json_data)
        if not form_data.is_valid():
            err_msg = form_data.errors
            return FailJsonResponse(err_msg)

        data = form_data.clean()
        bk_app_event.status = data["status"]
        bk_app_event.save()

        models.BkAppEventLog.objects.create(bk_app_event=bk_app_event, log=data["log"])

        return OKJsonResponse(data={"event_id": event_id})


class HealthCheckView(View):

    def _check_db(self):
        import django.db
        with django.db.connection.cursor() as c:
            c.execute("SELECT 0")

    def _check_agent(self):
        bk_servers = models.BkServer.objects.filter(is_active=True)
        if not bk_servers:
            raise Exception("have not registered and activated applicable app servers")

        for bk_server in bk_servers:
            check_agent_health(bk_server)

    def get(self, request):
        try:
            self._check_db()
        except Exception, e:
            err_msg = "database health check failed! database connection exception %s" % e
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)

        try:
            self._check_agent()
        except Exception, e:
            err_msg = "paasagent health check failed, error: %s" % e
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)
        else:
            return OKJsonResponse()


class AgentHealthCheckView(View):
    def get(self, request, server_id):
        try:
            bk_server = models.BkServer.objects.get(id=int(server_id))
            check_agent_health(bk_server)
            return OKJsonResponse()
        except Exception, e:
            err_msg = "health check failed: %s" % e
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)


class ServiceHealthCheckView(View):
    def get(self, request, server_name, server_id):
        try:
            server_manager = servicemanager.ServiceManagerFactory(server_name)
            server_manager.health_check(server_id)
            return OKJsonResponse()
        except Exception, e:
            logger.exception(e)
            return FailJsonResponse(str(e))


class ServiceServerViewSet(BaseView):
    def post(self, request, service_name):
        if service_name != models.THIRD_SERVER_CATEGORY_MQ:
            return FailJsonResponse("not support %s server register" % service_name)

        category = service_name
        form_data = forms.ServiceServerRegisterForm({"server_ip": request.json_data.get("server_ip")})
        if not form_data.is_valid():
            err_msg = form_data.errors
            return FailJsonResponse(err_msg)

        data = form_data.clean()
        server_ip = data["server_ip"]

        if models.ThirdServer.objects.filter(category=category, is_active=True):
            return FailJsonResponse(
                "the %s cluster has been already activated, thus ip %s cannot be activated again"
                % (models.THIRD_SERVER_CATEGORY_MQ, server_ip))

        server, _ = servicemanager.update_or_create_rabbitmq_server(
            server_ip=server_ip,
            username=request.json_data.get('username', 'admin'),
            password=request.json_data.get('password', 'admin')
        )

        service_manager = servicemanager.ServiceManagerFactory(service_name)
        try:
            service_manager.health_check(server.id)
            server.is_active = True
            server.save()
            return OKJsonResponse()
        except Exception, e:
            err_msg = "%s registered, but active failed: %s" % (server_ip, e)
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)

    def put(self, request, service_name, server_id):
        if service_name != models.THIRD_SERVER_CATEGORY_MQ:
            return FailJsonResponse("not support %s server register" % service_name)

        try:
            service_server = models.ThirdServer.objects.get(id=server_id, category=service_name)
        except models.ThirdServer.DoesNotExist:
            return FailJsonResponse("id %s server not registered" % server_id)

        if not service_server.is_active and has_active_thirdserver(service_server.category):
            return FailJsonResponse(
                "the %s cluster has been already activated, thus id %s cannot be activated again"
                % (service_server.category, server_id))

        service_manager = servicemanager.ServiceManagerFactory(service_server.category)
        try:
            service_manager.health_check(server_id)
            service_server.is_active = True
            service_server.save()
            return OKJsonResponse()
        except Exception, e:
            service_server.is_active = False
            service_server.save()
            err_msg = "%s registered, but active failed: %s" % (server_id, e)
            logger.exception(err_msg)
            return FailJsonResponse(err_msg)


# AgentRegistryView will be deprecated
class AgentRegistryView(View):

    def post(self, request, *args, **kwargs):
        form_data = forms.AgentRegisterForm(request.POST)
        if not form_data.is_valid():
            err_msg = form_data.errors
            return JsonResponse({"msg": err_msg}, status=400)

        data = form_data.clean()

        server_category = get_server_category(data["mode"])
        agent_ip = data["agent_ip"]
        server_params = {
            "app_port": data["web_port"],
            "ip_port": data["agent_port"],
            "category": server_category,
            "is_active": False
        }

        bk_server, _ = models.BkServer.objects.update_or_create(ip_address=agent_ip, defaults=server_params)

        active_server = models.BkServer.objects.filter(category=server_category, is_active=True)
        if active_server:
            err_msg = "%s environment has already one activated server, thus ip %s cannot be activated again" \
                      % (data["mode"], agent_ip)
            return JsonResponse({"msg": err_msg})
        return JsonResponse({"sid": bk_server.s_id, "token": bk_server.token})

    def get(self, request):
        form_data = forms.AgentServerRegisterForm({"agent_ip": request.GET.get('agent_ip', '')})
        if not form_data.is_valid():
            err_msg = form_data.errors
            return JsonResponse({"msg": err_msg}, status=400)

        data = form_data.clean()
        agent_ip = data["agent_ip"]
        try:
            bk_server = models.BkServer.objects.get(ip_address=agent_ip)
        except Exception, e:
            return JsonResponse({"msg": "active server ip %s exception: %s" % (agent_ip, e)}, status=400)

        try:
            resp = check_agent_health(bk_server)
            bk_server.is_active = True
            bk_server.mac = resp.get("mac", "")
            bk_server.save()
            return JsonResponse({"agent_ip": bk_server.ip_address})
        except Exception, e:
            bk_server.is_active = False
            bk_server.save()
            err_msg = "active server ip %s exception: %s" % (agent_ip, e)
            logger.exception(err_msg)
            return JsonResponse({"msg": err_msg}, status=400)


# MqRegistryView will be deprecated
class MqRegistryView(View):
    def post(self, request):
        form_data = forms.ServiceServerRegisterForm({"server_ip": request.POST.get("mq_ip", '')})
        if not form_data.is_valid():
            err_msg = form_data.errors
            return JsonResponse({"msg": err_msg}, status=400)

        data = form_data.clean()
        server_ip = data["server_ip"]

        if models.ThirdServer.objects.filter(category=models.THIRD_SERVER_CATEGORY_MQ, is_active=True):
            err_msg = "the %s cluster has been already activated, thus ip %s cannot be activated again" \
                      % (models.THIRD_SERVER_CATEGORY_MQ, server_ip)
            return JsonResponse({"msg": err_msg})

        server, _ = servicemanager.update_or_create_rabbitmq_server(
            server_ip=server_ip,
            username=request.POST.get('username', 'admin'),
            password=request.POST.get('password', 'admin')
        )

        service_manager = servicemanager.ServiceManagerFactory(models.THIRD_SERVER_CATEGORY_MQ)
        try:
            service_manager.health_check(server.id)
            server.is_active = True
            server.save()
            return JsonResponse({"mq_ip": server_ip})
        except Exception, e:
            err_msg = "%s registered, but active failed: %s" % (server_ip, e)
            logger.exception(err_msg)
            return JsonResponse({"msg": err_msg}, status=400)
