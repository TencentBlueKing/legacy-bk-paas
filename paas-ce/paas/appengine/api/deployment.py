# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
"""  # noqa
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
        # 创建APP上线日志
        event_type = "app.%s.deploy" % self.mode
        self.bk_event = models.BkEvent.objects.create(
            event_type=event_type,
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
            self._fail_bk_event(str(e))
            return self.bk_event.id, 20300, str(e)

        if service_envs:
            self._set_envs(service_envs)

        try:
            bk_servers = self._assign_servers()

            for bk_server in bk_servers:
                bk_hosting_ship = models.BkHostingShip.objects.get(bk_app=self.bk_app, bk_server=bk_server)
                # 创建APP上线对应paas_agent服务器的日志
                self.bk_app_event = models.BkAppEvent.objects.create(
                    bk_app=self.bk_app,
                    bk_event_id=self.bk_event.id,
                    server_id=bk_server.id,
                    event_type=event_type,
                    status="READY",
                    is_master=bk_hosting_ship.is_master
                )

                self._request(bk_server, "online", bk_hosting_ship.is_master)
            return self.bk_event.id, 0, "job delivered"
        except Exception, e:
            logger.exception(str(e))
            self._fail_bk_event(str(e))
            return self.bk_event.id, 1, str(e)

    def _assign_servers(self):
        category = utils.get_server_category(self.mode)
        assigned_servers = self.bk_app.bkserver_set.filter(category=category, is_active=True)
        if assigned_servers:
            return list(assigned_servers)

        bk_servers = models.BkServer.objects.filter(category=category, is_active=True)
        if not bk_servers.exists():
            raise Exception("no %s servers avaliable. you need to install PaasAgent "
                            "on at least one server and register the server to PaaS" % self.mode)

        # BkHostingShip will be deprecated
        # 建立蓝鲸APP和服务信息的关联关系，默认部署到当前环境的所有服务器上
        for index, bk_server in enumerate(bk_servers):
            # 默认选择第一台服务器为mater
            is_master = True if index == 0 else False
            models.BkHostingShip.objects.create(bk_app=self.bk_app, bk_server=bk_server, is_master=is_master)
        return list(bk_servers)

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
        # 创建APP下架日志
        event_type = "app.%s.offline" % self.mode
        self.bk_event = models.BkEvent.objects.create(
            event_type=event_type,
            status="READY"
        )

        category = utils.get_server_category(self.mode)
        try:
            assigned_servers = self.bk_app.bkserver_set.filter(category=category, is_active=True)
            for assigned_server in assigned_servers:
                bk_hosting_ship = models.BkHostingShip.objects.get(bk_app=self.bk_app, bk_server=assigned_server)

                # 创建APP下架对应paas_agent服务器的日志
                self.bk_app_event = models.BkAppEvent.objects.create(
                    bk_app=self.bk_app,
                    bk_event_id=self.bk_event.id,
                    server_id=assigned_server.id,
                    event_type=event_type,
                    status="READY",
                    is_master=bk_hosting_ship.is_master
                )

                self._request(assigned_server, "offline", bk_hosting_ship.is_master)
            return self.bk_event.id, 0, "job delivered"
        except Exception, e:
            self._fail_bk_event(str(e))
            return self.bk_event.id, 1, str(e)

    def _request(self, bk_server, handle, is_master):
        params = {
            "app_code": self.bk_app.app_code,
            "event_id": str(self.bk_app_event.id),
            "deploy_token": self.deploy_config.get("deploy_token", ''),
            "deploy_vars": self.deploy_config.get("deploy_vars", {}),
            "saas_settings": self.deploy_config.get("saas_settings", {}),
            "mode": self.mode,
            "envs": self.bk_app.app_envs[self.mode],
            "is_master": is_master
        }

        resp = http.http_request(
            method="POST",
            url="http://%s:%s/v1/app/%s" % (bk_server.ip_address, bk_server.ip_port, handle),
            headers=utils.agent_header(bk_server.s_id, bk_server.token),
            json=params
        )
        if resp["error"] != 0:
            raise Exception(resp.get("msg"))

    def _fail_bk_event(self, message):
        self.bk_event.status = "FAILURE"
        self.bk_event.message = message
        self.bk_event.save()
