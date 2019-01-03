# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import json
import uuid

from django.db import models

from common.log import logger
from engine.constants import (SERVER_CATEGORY_CHOICES,
                              THIRD_SERVER_CATEGORY_CHOICES,
                              ServerCategoryEnum, ExternalServerCategoryEnum)
from engine.manager import BkServerManager, ExternalServerManager


class BkCluster(models.Model):

    name = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "engine_clusters"
        verbose_name = "cluster info"
        ordering = ('created_at',)


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

    def __unicode__(self):
        return self.app_code

    class Meta:
        db_table = "engine_apps"
        verbose_name = "app info"
        ordering = ('created_at',)


class BkAppToken(models.Model):

    bk_app = models.ForeignKey(BkApp, on_delete=models.CASCADE)
    key = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.key

    class Meta:
        db_table = "engine_app_tokens"
        verbose_name = "app token"
        ordering = ('created_at',)


class BkServer(models.Model):
    name = models.CharField(u'名称', max_length=20)
    s_id = models.UUIDField(u'服务ID', default=uuid.uuid4, editable=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    ip_address = models.CharField(u'IP地址', max_length=36)
    ip_port = models.CharField(u'Agent端口', max_length=36, default='4245')
    app_port = models.CharField(u'App端口', max_length=36, default='8085')
    category = models.CharField(u'分类', max_length=36, choices=SERVER_CATEGORY_CHOICES,
                                default=ServerCategoryEnum.TEST.value)
    info = models.CharField(u'备注', max_length=200)
    is_active = models.BooleanField(u'启用', default=False)
    apps = models.ManyToManyField(BkApp, blank=True, through='BkHostingShip')
    mac = models.CharField(u'MAC地址', max_length=36, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BkServerManager()

    class Meta:
        db_table = "engine_servers"
        verbose_name = "服务器信息"
        verbose_name_plural = "服务器信息"
        ordering = ('created_at',)


class ThirdServer(models.Model):
    category = models.CharField(u'分类', max_length=36, choices=THIRD_SERVER_CATEGORY_CHOICES,
                                default=ExternalServerCategoryEnum.MQ.value)
    server_info = models.TextField("服务器信息")
    info = models.CharField(u'备注', max_length=200)
    is_active = models.BooleanField(u'启用', default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ExternalServerManager()

    @property
    def server_data(self):
        try:
            return json.loads(self.server_info)
        except Exception:
            logger.exception("获取服务器信息异常: server_info=%s", self.server_info)
            return {}

    @property
    def ip_address(self):
        try:
            server_info = json.loads(self.server_info)
            return server_info.get('ip_address', '')
        except Exception:
            logger.exception("获取服务器IP信息异常: server_info=%s", self.server_info)
            return ''

    @property
    def ip_port(self):
        try:
            server_info = json.loads(self.server_info)
            return server_info.get('ip_port', '')
        except Exception:
            logger.exception("获取服务器端口信息异常: server_info=%s", self.server_info)
            return ''

    class Meta:
        db_table = "engine_third_servers"
        verbose_name = "第三方服务器信息"
        verbose_name_plural = "第三方服务器信息"
        ordering = ('created_at',)


class BkHostingShip(models.Model):

    bk_app = models.ForeignKey(BkApp)
    bk_server = models.ForeignKey(BkServer)
    is_active = models.BooleanField(default=True)
    is_master = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "engine_hosting_ships"
        verbose_name = "router map"
        ordering = ('created_at',)

    def __str__(self):
        return "{0}-{1}-{2}".format(self.bk_server.ip_address, self.bk_server.ip_port, self.bk_server.is_active)


class BkAppEnv(models.Model):

    bk_app = models.ForeignKey(BkApp)
    mode = models.CharField(max_length=200)
    key = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "engine_app_envs"
        verbose_name = "app env"
        ordering = ('created_at',)


class BkAppEvent(models.Model):

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    bk_app = models.ForeignKey(BkApp)
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

    class Meta:
        db_table = "engine_app_events"
        verbose_name = "app event"
        ordering = ('created_at',)


class BkAppEventLog(models.Model):

    bk_app_event = models.ForeignKey(BkAppEvent)
    log = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "engine_app_event_logs"
        verbose_name = "app event log"
        ordering = ('created_at',)

    def __str__(self):
        return "{0}-{1}".format(self.id, self.log)
