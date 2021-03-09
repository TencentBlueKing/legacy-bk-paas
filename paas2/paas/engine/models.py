# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
import json
import uuid

from django.db import models
from django.utils.translation import ugettext as _, ugettext_lazy as _l

from common.log import logger

from engine.constants import (
    CATEGORY_SERVER_TEST,
    SERVER_CATEGORY_CHOICES,
    THIRD_SERVER_CATEGORY_MQ,
    THIRD_SERVER_CATEGORY_CHOICES,
    ENVIRONMENT_CHOICES,
)
from engine.manager import BkServerManager, ThirdServerManager, BkHostingShipManager


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

    def __unicode__(self):
        return self.app_code

    class Meta:
        db_table = "engine_apps"
        verbose_name = "app info"
        ordering = ("created_at",)


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
        ordering = ("created_at",)


class BkServer(models.Model):

    name = models.CharField(_l(u"名称"), max_length=20)
    s_id = models.UUIDField(_l(u"服务ID"), default=uuid.uuid4, editable=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    ip_address = models.CharField(_l(u"IP地址"), max_length=36)
    ip_port = models.CharField(_l(u"Agent端口"), max_length=36, default="4245")
    app_port = models.CharField(_l(u"App端口"), max_length=36, default="8085")
    category = models.CharField(
        _l(u"分类"), max_length=36, choices=SERVER_CATEGORY_CHOICES, default=CATEGORY_SERVER_TEST
    )
    info = models.CharField(_l(u"备注"), max_length=200)
    is_active = models.BooleanField(_l(u"启用"), default=False)
    apps = models.ManyToManyField(BkApp, blank=True, through="BkHostingShip")
    mac = models.CharField(_l(u"MAC地址"), max_length=36, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BkServerManager()

    class Meta:
        db_table = "engine_servers"
        verbose_name = _l(u"服务器信息")
        verbose_name_plural = _l(u"服务器信息")
        ordering = ("created_at",)


class ThirdServer(models.Model):
    category = models.CharField(
        _l(u"分类"), max_length=36, choices=THIRD_SERVER_CATEGORY_CHOICES, default=THIRD_SERVER_CATEGORY_MQ
    )
    server_info = models.TextField(_l(u"服务器信息"))
    info = models.CharField(_l(u"备注"), max_length=200)
    is_active = models.BooleanField(_l(u"启用"), default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ThirdServerManager()

    @property
    def server_data(self):
        try:
            data = json.loads(self.server_info)
            data["password"] = "******"
            return data
        except Exception:
            logger.exception(u"获取服务器信息异常")
            return {}

    @property
    def ip_address(self):
        try:
            server_info = json.loads(self.server_info)
            ip_address = server_info.get("ip_address", "")
            return ip_address
        except Exception:
            logger.exception(u"获取服务器IP信息异常")
            return ""

    @property
    def ip_port(self):
        try:
            server_info = json.loads(self.server_info)
            ip_port = server_info.get("ip_port", "")
            return ip_port
        except Exception:
            logger.exception(u"获取服务器端口信息异常")
            return ""

    @property
    def category_display(self):
        cate = self.get_category_display()
        return _(cate)

    class Meta:
        db_table = "engine_third_servers"
        verbose_name = _l(u"第三方服务器信息")
        verbose_name_plural = _l(u"第三方服务器信息")
        ordering = ("created_at",)


# TODO: add a manager here
# select where app=1 and is_active=1


class BkHostingShip(models.Model):

    bk_app = models.ForeignKey(BkApp)
    bk_server = models.ForeignKey(BkServer)
    is_active = models.BooleanField(default=True)
    is_master = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BkHostingShipManager()

    class Meta:
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

    class Meta:
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

    class Meta:
        db_table = "engine_events"
        verbose_name = "father event"
        ordering = ("created_at",)


class BkAppEvent(models.Model):

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
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

    class Meta:
        db_table = "engine_app_events"
        verbose_name = "app event"
        ordering = ("created_at",)


class BkAppEventLog(models.Model):

    bk_app_event = models.ForeignKey(BkAppEvent)
    log = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "engine_app_event_logs"
        verbose_name = "app event log"
        ordering = ("created_at",)

    def __str__(self):
        return "{0}-{1}".format(self.id, self.log)


class BkAppBindPort(models.Model):
    bk_app = models.ForeignKey(BkApp, on_delete=models.CASCADE)
    mode = models.CharField(max_length=10, choices=ENVIRONMENT_CHOICES, default="test")
    port = models.IntegerField(u"使用的服务器端口号")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "engine_app_bind_port"
        verbose_name = "app bind port"
        unique_together = ("bk_app", "mode", "port")
        ordering = ("created_at",)
