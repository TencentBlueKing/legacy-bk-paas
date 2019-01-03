# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db import models

from common.constants import LogoImgRelatedDirEnum
from home.constants import LINK_TYPE_CHOICES, LinkTypeEnum
from home.manager import UsefulLinksManager, UserAppsManager


class UserApps(models.Model):
    """
    用户收藏应用信息
    """
    username = models.CharField("用户名称", max_length=128, unique=True)
    apps = models.TextField("应用列表", default='', blank=True, null=True, help_text="格式：json数据[code1,code2,code3]")

    objects = UserAppsManager()

    def __unicode__(self):
        return '%s' % self.username

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'paas_userapps'
        verbose_name = "用户收藏应用"
        verbose_name_plural = "用户收藏应用"


class UserSettings(models.Model):
    """
    首页上用户自定义的应用列表
    """
    username = models.CharField("用户名称", max_length=128, unique=True)
    apps = models.TextField("应用列表", default='', blank=True, null=True, help_text="格式：json数据[code1,code2,code3]")

    def __unicode__(self):
        return '%s' % self.username

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'paas_usersettings'
        verbose_name = "用户自定义的应用列表"
        verbose_name_plural = "用户自定义的应用列表"


class UsefulLinks(models.Model):
    """
    常用链接
    """
    name = models.CharField("名称", max_length=128)
    link = models.CharField("链接", max_length=128)
    link_type = models.SmallIntegerField("类型", choices=LINK_TYPE_CHOICES, default=LinkTypeEnum.COMMON.value)
    logo = models.ImageField(upload_to=LogoImgRelatedDirEnum.ICON.value, blank=True, null=True)
    introduction = models.TextField("应用简介", default='', blank=True, null=True)
    is_active = models.BooleanField("是否激活", default=True)
    created_time = models.DateTimeField("创建时间", auto_now_add=True, blank=True, null=True)

    objects = UsefulLinksManager()

    def __unicode__(self):
        return '%s' % self.name

    def __str__(self):
        return self.name

    @property
    def code(self):
        return '_{id}'.format(id=self.pk)

    def to_dict(self):
        return {
            'name': self.name,
            'link': self.link,
            'logo': self.logo.url,
            'introduction': self.introduction,
            'code': self.code
        }

    class Meta:
        db_table = 'paas_usefullinks'
        ordering = ['created_time']
        verbose_name = "常用链接"
        verbose_name_plural = "常用链接"
