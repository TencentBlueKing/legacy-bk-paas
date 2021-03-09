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

from __future__ import unicode_literals

from django.db import models

from bkaccount.manager import LoginLogManager


class Loignlog(models.Model):
    """
    User login log
    """

    username = models.CharField("用户名", max_length=128, blank=True, null=True)
    login_time = models.DateTimeField("登录时间")
    login_browser = models.CharField("登录浏览器", max_length=200, blank=True, null=True)
    login_ip = models.CharField("用户登录ip", max_length=50, blank=True, null=True)
    login_host = models.CharField("登录HOST", max_length=100, blank=True, null=True)
    app_id = models.CharField("APP_ID", max_length=30, blank=True, null=True)

    objects = LoginLogManager()

    def __unicode__(self):
        return "%s(%s)" % (self.user.chname, self.user.username)

    class Meta:
        db_table = "login_bklog"
        verbose_name = "用户登录日志"
        verbose_name_plural = "用户登录日志"


class BkToken(models.Model):
    """
    登录票据
    """

    token = models.CharField("登录票据", max_length=255, unique=True, db_index=True)
    # 是否已经退出登录
    is_logout = models.BooleanField("票据是否已经执行过退出登录操作", default=False)
    # 无操作过期时间戳
    inactive_expire_time = models.IntegerField("无操作失效时间戳", default=0)

    def __uincode__(self):
        return self.token

    class Meta:
        db_table = "login_bktoken"
        verbose_name = "登录票据"
        verbose_name_plural = "登录票据"
