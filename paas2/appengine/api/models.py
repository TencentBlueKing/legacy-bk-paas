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
from builtins import object
import uuid
import json
import random
import copy
import logging

from django.db import models

from api.constants import (
    SERVER_CATEGORY_CHOICES,
    ENVIRONMENT_CHOICES,
    THIRD_SERVER_CATEGORY_MQ,
    THIRD_SERVER_CATEGORY_CHOICES,
)
from api import http
from api.utils import (
    get_category_by_mode,
    PortManager,
    get_assigned_servers,
    is_online_event,
    parse_event_type,
    is_paasagent_active,
)
from api.exceptions import EngineErrorCodes

logger = logging.getLogger("root")


def update_hostships(app_code, bk_event):
    mode = parse_event_type(bk_event.event_type)["mode"]
    BkHostingShip.objects.filter(bk_app__app_code=app_code, bk_server__category=get_category_by_mode(mode)).delete()

    bk_app_events = BkAppEvent.objects.filter(bk_event_id=bk_event.id)
    server_ids = [app_event.server_id for app_event in bk_app_events if is_online_event(app_event.event_type)]
    server_qsets = BkServer.objects.filter(id__in=server_ids)

    if is_online_event(bk_event.event_type):
        bk_app = BkApp.objects.get(app_code=app_code)
        for server in server_qsets:
            BkHostingShip.objects.create(bk_app=bk_app, bk_server=server, is_active=True)


def delete_hostships(server_id):
    BkHostingShip.objects.filter(bk_server__id=server_id).delete()


def assign_servers(mode, old_server_ids, server_ids):
    category = get_category_by_mode(mode)
    if mode == "test":
        if old_server_ids:
            return old_server_ids
        bk_servers = BkServer.objects.filter(category=category, is_active=True)
        random_idx = random.randint(0, bk_servers.count() - 1)
        bk_server = bk_servers[random_idx]
        return [
            bk_server.id,
        ]

    return server_ids


def caculate_off_servers(old_server_ids, new_server_ids):
    old_ids = set(old_server_ids)
    new_ids = set(new_server_ids)
    return list(old_ids - new_ids)


def planning_deployments(bk_app, mode, server_ids):
    app_code = bk_app.app_code
    old_servers = get_assigned_servers(app_code, mode)
    old_server_ids = [server.id for server in old_servers]
    server_ids = assign_servers(mode, old_server_ids, server_ids)
    logger.debug("planning_deployments server_ids %s" % server_ids)
    logger.debug("planning_deployments old_server_ids %s" % old_server_ids)

    if len(server_ids) > 1:
        return server_ids[0], server_ids[1:], caculate_off_servers(old_server_ids, server_ids)
    return server_ids[0], [], caculate_off_servers(old_server_ids, server_ids)


class BkCluster(models.Model):
    name = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_clusters"
        verbose_name = "cluster info"
        ordering = ("created_at",)


class BkApp(models.Model):
    name = models.CharField(max_length=20)
    logo = models.CharField(max_length=100)
    app_code = models.CharField(max_length=100, unique=True)
    app_lang = models.CharField(max_length=100)
    app_type = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def token(self):
        return self.bkapptoken_set.first().key

    @property
    def app_envs(self):
        app_envs = {"test": {}, "prod": {}}
        for app_env in self.bkappenv_set.all():
            mode, key, value = app_env.mode, app_env.key, app_env.value
            app_envs[mode][key] = value
        return app_envs

    def releases(self, event_id, mode, server_ids, envs, **kwargs):
        """Do App release job """
        try:
            master_sid, slave_sids, off_sids = planning_deployments(self, mode, server_ids)
        except Exception:
            err_msg = "%s Failed to planning deployments for App:%s" % (
                EngineErrorCodes.E1304301_ASSIGN_SERVER_ERROR,
                self.app_code,
            )
            logger.exception(err_msg)
            return False, {"error": -1, "msg": err_msg}

        # only for java
        language = self.app_lang.lower()
        if language == "java":
            try:
                port_manager = PortManager(
                    bk_app=self,
                    mode=mode,
                    server_ids=[
                        master_sid,
                    ]
                    + slave_sids,
                )
                envs["CONTAINER_PORT"] = str(port_manager.bind_app_to_port())
            except Exception:
                err_msg = "%s Failed to manage port to App:%s" % (
                    EngineErrorCodes.E1304302_ASSIGN_PORT_ERROR,
                    self.app_code,
                )
                logger.exception(err_msg)
                return False, {"error": -1, "msg": err_msg}

        # 部署Master节点，失败则直接返回
        deploy_kwargs = copy.deepcopy(kwargs)
        deploy_kwargs["language"] = self.app_lang.lower()
        deploy_kwargs["envs"] = envs
        return self._release(event_id, mode, master_sid, slave_sids, off_sids, **deploy_kwargs)

    def _release(self, event_id, mode, master_sid, slave_sids, off_sids, **deploy_kwargs):
        logger.debug("master_sid %s" % master_sid)
        logger.debug("slave_sids %s" % slave_sids)
        logger.debug("off_sids %s" % off_sids)

        try:
            master_server = BkServer.objects.get(id=master_sid)
            master_ret, master_data = self._deploy(
                bk_server=master_server, event_id=event_id, is_master=True, mode=mode, handle="online", **deploy_kwargs
            )
            if not master_data:
                err_msg = "%s Failed to deploy App:%s on Master Server(%s), response error" % (
                    EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                    self.app_code,
                    master_server.ip_address,
                )
                logger.error(err_msg)
                return False, {"error": -1, "msg": err_msg}
        except Exception:
            err_msg = "%s Failed to deploy App:%s on Master Server" % (
                EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                self.app_code,
            )
            logger.exception(err_msg)
            return False, {"error": -1, "msg": err_msg}

        try:
            for slave_sid in slave_sids:
                slave_server = BkServer.objects.get(id=slave_sid)
                slave_ret, _ = self._deploy(
                    bk_server=slave_server,
                    event_id=event_id,
                    is_master=False,
                    mode=mode,
                    handle="online",
                    **deploy_kwargs
                )
                if not slave_ret:
                    err_msg = "%s Failed to deploy App:%s on Slave Server(%s), response error" % (
                        EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                        self.app_code,
                        slave_server.ip_address,
                    )
                    logger.error(err_msg)
                    return False, {"error": -1, "msg": err_msg}

        except Exception:
            err_msg = "%s Failed to deploy App:%s on Slave Server" % (
                EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                self.app_code,
            )
            logger.exception(err_msg)
            return False, {"error": -1, "msg": err_msg}

        if not off_sids:
            return True, master_data

        return self._offline(event_id, mode, off_sids)

    def offline(self, event_id, mode):
        return self._offline(event_id, mode)

    def _offline(self, event_id, mode, off_ids=None):
        if off_ids is None:
            off_servers = get_assigned_servers(self.app_code, mode)
            if not off_servers:
                return False, {
                    "error": -1,
                    "msg": "%s Failed to offline App:%s on available Server"
                    % (EngineErrorCodes.E1304101_PAASAGENT_ERROR, self.app_code),
                }

            # port manager for java container
            language = self.app_lang.lower()
            if language == "java":
                try:
                    port_manager = PortManager(bk_app=self, mode=mode)
                    port_manager.recycle_app_port()
                except Exception:
                    err_msg = "%s Failed to manage port to App:%s" % (
                        EngineErrorCodes.E1304302_ASSIGN_PORT_ERROR,
                        self.app_code,
                    )
                    logger.exception(err_msg)
                    return False, {"error": -1, "msg": err_msg}
        else:
            logger.debug("_offline off_ids %s" % off_ids)
            off_servers = BkServer.objects.filter(id__in=off_ids)

        off_servers_list = [{"off_server": off_server, "is_master": False} for off_server in off_servers]
        if off_ids is None:
            off_servers_list[0]["is_master"] = True

        try:
            for off_server in off_servers_list:
                if not is_paasagent_active(off_server["off_server"]):
                    continue
                off_ret, _ = self._deploy(
                    bk_server=off_server["off_server"],
                    event_id=event_id,
                    is_master=off_server["is_master"],
                    mode=mode,
                    handle="offline",
                    **{}
                )
                if not off_ret:
                    err_msg = "%s Failed to offline App:%s on Server(%s), response error" % (
                        EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                        self.app_code,
                        off_server["off_server"].ip_address,
                    )
                    logger.error(err_msg)
                    return False, {"error": -1, "msg": err_msg}

        except Exception:
            err_msg = "%s Failed to offline App:%s on Server" % (
                EngineErrorCodes.E1304101_PAASAGENT_ERROR,
                self.app_code,
            )
            logger.exception(err_msg)
            return False, {"error": -1, "msg": err_msg}

        return True, {"error": 0}

    def _deploy(self, bk_server, event_id, is_master, mode, handle, **kwargs):
        bk_app_event = BkAppEvent.objects.create(
            bk_app=self,
            bk_event_id=event_id,
            server_id=bk_server.id,
            is_master=is_master,
            event_type="app.{}.{}".format(mode, handle),
            status="READY",
        )
        params = {
            "app_code": self.app_code,
            "event_id": str(bk_app_event.id),
            "deploy_token": kwargs.get("deploy_token", ""),
            "deploy_vars": kwargs.get("deploy_vars", {}),
            "saas_settings": kwargs.get("saas_settings", {}),
            "is_master": is_master,
            "mode": mode,
            "language": kwargs.get("language", "python"),
            "envs": kwargs.get("envs", {}),
        }
        return http.http_post(
            url="http://{}:{}/v1/app/{}".format(bk_server.ip_address, bk_server.ip_port, handle),
            sid=bk_server.s_id,
            token=bk_server.token,
            params=params,
        )

    class Meta(object):
        db_table = "engine_apps"
        verbose_name = "app info"
        ordering = ("created_at",)


class BkAppToken(models.Model):
    bk_app = models.ForeignKey(BkApp, on_delete=models.CASCADE)
    key = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_app_tokens"
        verbose_name = "app token"
        ordering = ("created_at",)


class BkServer(models.Model):
    name = models.CharField(u"名称", max_length=20)
    s_id = models.UUIDField(u"服务ID", default=uuid.uuid4, editable=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    ip_address = models.CharField(u"IP地址", max_length=36)
    ip_port = models.CharField(u"agent端口", max_length=36, default="4245")
    app_port = models.CharField(u"app端口", max_length=36, default="8085")
    category = models.CharField(u"分类", max_length=36, choices=SERVER_CATEGORY_CHOICES, default="tapp")
    info = models.CharField(u"备注", max_length=200)
    is_active = models.BooleanField(u"启用", default=True)
    apps = models.ManyToManyField(BkApp, blank=True, through="BkHostingShip")
    mac = models.CharField(u"MAC地址", max_length=36, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_servers"
        verbose_name = u"服务器信息"
        verbose_name_plural = u"服务器信息"
        ordering = ("created_at",)


class BkHostingShip(models.Model):
    bk_app = models.ForeignKey(BkApp)
    bk_server = models.ForeignKey(BkServer)
    is_active = models.BooleanField(default=True)
    # is_master not used
    is_master = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_hosting_ships"
        verbose_name = "router map"
        ordering = ("created_at",)

    def __str__(self):
        return "{0}-{1}-{2}".format(self.bk_server.ip_address, self.bk_server.ip_port, self.bk_server.is_active)


class BkAppEnv(models.Model):
    bk_app = models.ForeignKey(BkApp)
    mode = models.CharField(max_length=200)
    key = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_app_envs"
        verbose_name = "app env"
        ordering = ("created_at",)


class BkEvent(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    event_type = models.CharField(max_length=200)
    message = models.TextField(default="")
    status = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_events"
        verbose_name = "father event"
        ordering = ("created_at",)


class BkAppEvent(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    # 旧事件暂不兼容
    bk_event_id = models.CharField(max_length=128, default="-1")
    is_master = models.BooleanField(default=True)
    bk_app = models.ForeignKey(BkApp)
    server_id = models.IntegerField(default=-1)
    event_type = models.CharField(max_length=200)
    status = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def logs(self):
        logs = ""
        for event_log in self.bkappeventlog_set.all():
            logs += event_log.log
        return logs

    class Meta(object):
        db_table = "engine_app_events"
        verbose_name = "app event"
        ordering = ("created_at",)


class BkAppEventLog(models.Model):
    bk_app_event = models.ForeignKey(BkAppEvent)
    log = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_app_event_logs"
        verbose_name = "app event log"
        ordering = ("created_at",)

    def __str__(self):
        return "{0}-{1}".format(self.id, self.log)


class ThirdServer(models.Model):
    category = models.CharField(
        u"分类", max_length=36, choices=THIRD_SERVER_CATEGORY_CHOICES, default=THIRD_SERVER_CATEGORY_MQ
    )
    server_info = models.TextField(u"服务器信息")
    info = models.CharField(u"备注", max_length=200)
    is_active = models.BooleanField(u"启用", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def server_data(self):
        try:
            return json.loads(self.server_info)
        except Exception:
            return {}

    class Meta(object):
        db_table = "engine_third_servers"
        verbose_name = u"第三方服务器信息"
        verbose_name_plural = u"第三方服务器信息"
        ordering = ("created_at",)


class BkAppBindPort(models.Model):
    bk_app = models.ForeignKey(BkApp, on_delete=models.CASCADE)
    mode = models.CharField(max_length=10, choices=ENVIRONMENT_CHOICES, default="test")
    port = models.IntegerField(u"使用的服务器端口号")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        db_table = "engine_app_bind_port"
        verbose_name = "app bind port"
        unique_together = ("bk_app", "mode", "port")
        ordering = ("created_at",)
