# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import logging

from api import models
from api import servicemanager
from api import utils
from common import http

logger = logging.getLogger("root")


class DeployController(object):

    def __init__(self, bk_app, mode, deploy_config):
        self.bk_app = bk_app
        self.mode = mode
        self.deploy_config = deploy_config

    def _init_envs(self):
        envs = self.deploy_config.get("envs", {})
        self._set_envs(envs)

    def _set_envs(self, envs):
        for key, value in envs.iteritems():
            models.BkAppEnv.objects.update_or_create(
                bk_app=self.bk_app, mode=self.mode, key=key,
                defaults={'key': key, 'value': value}
            )

    def online(self):
        self.bk_app_event = models.BkAppEvent.objects.create(
            bk_app=self.bk_app,
            event_type="app.%s.deploy" % self.mode,
            status="READY"
        )
        self._init_envs()

        service_envs = {}
        try:
            service_names = self._use_third_service()
            for service_name in service_names:
                service_envs.update(self._apply_third_service(service_name))
        except Exception, e:
            logger.exception(str(e))
            self._fail_bk_app_event(str(e))
            return self.bk_app_event.id, 20300, str(e)

        if service_envs:
            self._set_envs(service_envs)

        try:
            bk_servers = self._assign_servers()
            self._request(bk_servers, "online")
            return self.bk_app_event.id, 0, "job delivered"
        except Exception, e:
            logger.exception(str(e))
            self._fail_bk_app_event(str(e))
            return self.bk_app_event.id, 1, str(e)

    def _assign_servers(self):
        category = utils.get_server_category(self.mode)
        assigned_servers = self.bk_app.bkserver_set.filter(category=category, is_active=True)
        if assigned_servers:
            return [assigned_servers[0], ]  # only one can active
        try:
            bk_server = models.BkServer.objects.get(category=category, is_active=True)
        except models.BkServer.DoesNotExist:
            raise Exception("no %s servers avaliable. you need to install PaasAgent "
                            "on at least one server and register the server to PaaS" % self.mode)
        # BkHostingShip will be deprecated
        models.BkHostingShip.objects.create(bk_app=self.bk_app, bk_server=bk_server, is_master=True)
        return [bk_server, ]

    def _use_third_service(self):
        service_names = []
        triggers = self.deploy_config.get("triggers", {})
        if triggers.get("is_use_celery"):
            service_names.append("rabbitmq")
        return service_names

    def _apply_third_service(self, service_name):
        triggers = self.deploy_config.get("triggers", {})
        service_manager = servicemanager.ServiceManagerFactory(service_name)
        return service_manager.apply(self.bk_app, self.mode, triggers)

    def offline(self):
        self.bk_app_event = models.BkAppEvent.objects.create(
            bk_app=self.bk_app,
            event_type="app.%s.offline" % self.mode,
            status="READY"
        )
        category = utils.get_server_category(self.mode)
        try:
            assigned_servers = self.bk_app.bkserver_set.filter(category=category, is_active=True)
            self._request(assigned_servers, "offline")
            return self.bk_app_event.id, 0, "job delivered"
        except Exception, e:
            self._fail_bk_app_event(str(e))
            return self.bk_app_event.id, 1, str(e)

    def _request(self, bk_servers, handle):
        params = {
            "app_code": self.bk_app.app_code,
            "event_id": str(self.bk_app_event.id),
            "deploy_token": self.deploy_config.get("deploy_token", ''),
            "deploy_vars": self.deploy_config.get("deploy_vars", {}),
            "saas_settings": self.deploy_config.get("saas_settings", {}),
            "mode": self.mode,
            "envs": self.bk_app.app_envs[self.mode],
        }
        for bk_server in bk_servers:
            resp = http.http_request(
                method="POST",
                url="http://%s:%s/v1/app/%s" % (bk_server.ip_address, bk_server.ip_port, handle),
                headers=utils.agent_header(bk_server.s_id, bk_server.token),
                json=params
            )
            if resp["error"] != 0:
                raise Exception(resp.get("msg"))

    def _fail_bk_app_event(self, message):
        self.bk_app_event.status = "FAILURE"
        self.bk_app_event.data = message
        self.bk_app_event.save()
